import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { memoryStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { PublicZaloSendBodyDto } from './dto/public-zalo-send-body.dto';
import { PublicZaloSendService } from './public-zalo-send.service';

const publicSendMultipart = FileFieldsInterceptor(
  [{ name: 'files', maxCount: 20 }],
  {
    storage: memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024, files: 20 },
  },
);

/**
 * Tích hợp bên thứ ba: header `x-api-key`, không dùng JWT.
 */
@Controller('public/zalo')
export class PublicZaloSendController {
  constructor(private readonly publicZaloSend: PublicZaloSendService) {}

  @Post('send')
  @HttpCode(200)
  @Public()
  @UseInterceptors(publicSendMultipart)
  send(
    @Headers('x-api-key') apiKey: string | undefined,
    @Body() body: PublicZaloSendBodyDto,
    @UploadedFiles() fileFields?: { files?: Express.Multer.File[] },
  ) {
    return this.publicZaloSend.send(apiKey, body, fileFields?.files);
  }
}
