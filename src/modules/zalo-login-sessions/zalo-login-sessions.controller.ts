import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../common/utils/authenticated-user';
import { UpsertZaloLoginSessionDto } from './dto/upsert-zalo-login-session.dto';
import { ZaloLoginSessionsService } from './zalo-login-sessions.service';

@Roles('ADMIN', 'USER')
@Controller('zalo-sessions')
export class ZaloLoginSessionsController {
  constructor(private readonly zaloLoginSessionsService: ZaloLoginSessionsService) {}

  @Post()
  upsert(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertZaloLoginSessionDto,
  ) {
    return this.zaloLoginSessionsService.upsert(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.zaloLoginSessionsService.listForUser(user.id);
  }

  @Delete()
  deleteAll(@CurrentUser() user: AuthenticatedUser) {
    return this.zaloLoginSessionsService.deleteAllForUser(user.id);
  }

  @Get('by-zalo-uid/:zaloUid')
  findByZaloUid(
    @CurrentUser() user: AuthenticatedUser,
    @Param('zaloUid') zaloUid: string,
  ) {
    return this.zaloLoginSessionsService.findLatestByZaloUid(user.id, zaloUid);
  }

  @Patch(':sessionId/touch')
  touch(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
  ) {
    return this.zaloLoginSessionsService.touch(user.id, sessionId);
  }

  @Get(':sessionId')
  findOneFull(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
  ) {
    return this.zaloLoginSessionsService.findOneFull(user.id, sessionId);
  }

  @Delete(':sessionId')
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string,
  ) {
    return this.zaloLoginSessionsService.deleteOne(user.id, sessionId);
  }
}
