import { Body, Controller, Headers, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { PublicApiService } from './public-api.service';
import { SendPublicMessageDto } from './dto/send-public-message.dto';

@Controller('public')
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  @Public()
  @Post('send-message')
  sendMessage(
    @Headers('x-api-key') apiKey: string | undefined,
    @Body() dto: SendPublicMessageDto,
  ) {
    return this.publicApiService.sendMessage(apiKey, dto);
  }
}
