import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '../api-keys/api-keys.service';
import { SendPublicMessageDto } from './dto/send-public-message.dto';

@Injectable()
export class PublicApiService {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async sendMessage(secretKey: string | undefined, dto: SendPublicMessageDto) {
    void dto;

    if (!secretKey?.trim()) {
      throw new UnauthorizedException('x-api-key header is required.');
    }

    const apiKey = await this.apiKeysService.validateSecretKey(secretKey);

    if (!apiKey) {
      throw new UnauthorizedException('Invalid or inactive API key.');
    }

    throw new BadRequestException(
      'Public API message sending is unavailable because Zalo interactions are now handled in the frontend.',
    );
  }
}
