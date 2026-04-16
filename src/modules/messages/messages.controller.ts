import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FindMessagesDto } from './dto/find-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(@Query() query: FindMessagesDto) {
    return this.messagesService.findAll(query);
  }

  @Post('send')
  send(@Body() dto: SendMessageDto) {
    return this.messagesService.send(dto);
  }

  @Post('recall/:id')
  recall(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.messagesService.recall(id);
  }
}
