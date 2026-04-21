import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../../common/utils/authenticated-user';
import { FindMessagesDto } from './dto/find-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@Roles('ADMIN', 'USER')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(@Query() query: FindMessagesDto) {
    return this.messagesService.findAll(query);
  }

  @Post('send')
  send(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.send(user.id, dto);
  }

  @Post('recall/:id')
  recall(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messagesService.recall(id);
  }
}
