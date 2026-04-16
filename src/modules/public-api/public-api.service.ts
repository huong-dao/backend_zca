import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { MessagesService } from '../messages/messages.service';
import { SendPublicMessageDto } from './dto/send-public-message.dto';

@Injectable()
export class PublicApiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly apiKeysService: ApiKeysService,
    private readonly messagesService: MessagesService,
  ) {}

  async sendMessage(secretKey: string | undefined, dto: SendPublicMessageDto) {
    if (!secretKey?.trim()) {
      throw new UnauthorizedException('x-api-key header is required.');
    }

    const apiKey = await this.apiKeysService.validateSecretKey(secretKey);

    if (!apiKey) {
      throw new UnauthorizedException('Invalid or inactive API key.');
    }

    const masterAccounts = await this.prismaService.zaloAccount.findMany({
      where: {
        isMaster: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 2,
      select: {
        id: true,
      },
    });

    if (masterAccounts.length === 0) {
      throw new NotFoundException('No master Zalo account is configured.');
    }

    if (masterAccounts.length > 1) {
      throw new BadRequestException(
        'Public API cannot resolve a master account because the current source specification does not define API key to master account mapping.',
      );
    }

    return this.messagesService.send({
      masterId: masterAccounts[0].id,
      groupId: dto.groupId,
      content: dto.content,
    });
  }
}
