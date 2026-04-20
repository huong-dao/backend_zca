import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZaloFindUserDto } from './dto/zalo-find-user.dto';
import { ZaloFriendActionDto } from './dto/zalo-friend-action.dto';
import { ZaloGetQrDto } from './dto/zalo-get-qr.dto';
import { ZaloGroupInfoDto } from './dto/zalo-group-info.dto';
import { ZaloGroupsQueryDto } from './dto/zalo-groups-query.dto';
import { ZaloSendFriendRequestDto } from './dto/zalo-send-friend-request.dto';
import { ZaloActionsService } from './zalo-actions.service';

/** Shared Zalo sessions: JWT required; sessionId is not scoped to current user. */
@Roles('ADMIN', 'USER')
@Controller('zalo/actions')
export class ZaloActionsController {
  constructor(private readonly zaloActionsService: ZaloActionsService) {}

  @Post('find-user')
  findUser(@Body() dto: ZaloFindUserDto) {
    return this.zaloActionsService.findUser(dto);
  }

  @Post('get-qr')
  getQr(@Body() dto: ZaloGetQrDto) {
    return this.zaloActionsService.getQr(dto);
  }

  @Post('send-friend-request')
  sendFriendRequest(@Body() dto: ZaloSendFriendRequestDto) {
    return this.zaloActionsService.sendFriendRequest(dto);
  }

  @Post('friend-request-status')
  friendRequestStatus(@Body() dto: ZaloFriendActionDto) {
    return this.zaloActionsService.friendRequestStatus(dto);
  }

  @Post('remove-friend')
  removeFriend(@Body() dto: ZaloFriendActionDto) {
    return this.zaloActionsService.removeFriend(dto);
  }

  @Get('groups')
  getAllGroups(@Query() query: ZaloGroupsQueryDto) {
    return this.zaloActionsService.getAllGroups(query.sessionId);
  }

  @Post('group-info')
  getGroupInfo(@Body() dto: ZaloGroupInfoDto) {
    return this.zaloActionsService.getGroupInfo(dto);
  }
}
