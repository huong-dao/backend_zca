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

/**
 * Zalo sessions are a shared pool: any authenticated USER/ADMIN may read/update/delete
 * a session by id. Bulk delete (`DELETE /zalo-sessions`) is **ADMIN only**.
 */
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
  list() {
    return this.zaloLoginSessionsService.listAll();
  }

  @Delete()
  @Roles('ADMIN')
  deleteAll() {
    return this.zaloLoginSessionsService.deleteAllSessions();
  }

  @Get('by-zalo-uid/:zaloUid')
  findByZaloUid(@Param('zaloUid') zaloUid: string) {
    return this.zaloLoginSessionsService.findLatestByZaloUid(zaloUid);
  }

  @Patch(':sessionId/touch')
  touch(@Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string) {
    return this.zaloLoginSessionsService.touchBySessionId(sessionId);
  }

  @Get(':sessionId')
  findOneFull(@Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string) {
    return this.zaloLoginSessionsService.findOneFullBySessionId(sessionId);
  }

  @Delete(':sessionId')
  @Roles('ADMIN')
  remove(@Param('sessionId', new ParseUUIDPipe({ version: '4' })) sessionId: string) {
    return this.zaloLoginSessionsService.deleteOneBySessionId(sessionId);
  }
}
