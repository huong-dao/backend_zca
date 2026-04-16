import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UpdateMessageIntervalDto } from './dto/update-message-interval.dto';

@Injectable()
export class ConfigsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.configuration.findMany({
      select: {
        id: true,
        key: true,
        value: true,
        updatedAt: true,
      },
      orderBy: {
        key: 'asc',
      },
    });
  }

  async updateMessageInterval(dto: UpdateMessageIntervalDto) {
    const configuration = await this.prismaService.configuration.upsert({
      where: {
        key: 'message_interval',
      },
      update: {
        value: String(dto.minutes),
      },
      create: {
        key: 'message_interval',
        value: String(dto.minutes),
      },
      select: {
        id: true,
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    return {
      ...configuration,
      minutes: Number.parseInt(configuration.value, 10),
    };
  }

  async getMessageIntervalMinutes() {
    const configuration = await this.prismaService.configuration.findUnique({
      where: {
        key: 'message_interval',
      },
      select: {
        value: true,
      },
    });

    if (!configuration) {
      throw new BadRequestException(
        'message_interval configuration is not set.',
      );
    }

    const minutes = Number.parseInt(configuration.value, 10);

    if (!Number.isFinite(minutes) || minutes < 0) {
      throw new BadRequestException(
        'message_interval configuration is invalid.',
      );
    }

    return minutes;
  }
}
