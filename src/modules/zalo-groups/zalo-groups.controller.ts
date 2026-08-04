import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../../common/utils/authenticated-user';
import { CreateMultipleZaloGroupsDto } from './dto/create-multiple-zalo-groups.dto';
import type { CreateMultipleZaloGroupsResult } from './dto/create-multiple-zalo-groups-result.dto';
import {
  FindZaloGroupsByAccountQuery,
  FindZaloGroupsDto,
} from './dto/find-zalo-groups.dto';
import { InviteMemberToZaloGroupDto } from './dto/invite-member-to-zalo-group.dto';
import { RemoveMemberFromZaloGroupDto } from './dto/remove-member-from-zalo-group.dto';
import { ChangeZaloGroupNameDto } from './dto/change-zalo-group-name.dto';
import { GetZaloGroupInfoDto } from './dto/get-zalo-group-info.dto';
import { UpsertZaloGroupDto } from './dto/upsert-zalo-group.dto';
import { ZaloGroupsService } from './zalo-groups.service';

// role both ADMIN and USER
@Roles('ADMIN', 'USER')
@Controller('zalo-groups')
export class ZaloGroupsController {
  constructor(private readonly zaloGroupsService: ZaloGroupsService) {}

  @Get()
  findAll(@Query() query: FindZaloGroupsDto) {
    return this.zaloGroupsService.findAll(query);
  }

  @Get('pending-name-update')
  findAllPendingNameUpdate() {
    return this.zaloGroupsService.findAllPendingNameUpdate();
  }

  @Get('account/:id')
  findAllByZaloAccountId(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('group_name') group_name?: string,
    @Query('global_id') global_id?: string,
  ) {
    const query: FindZaloGroupsByAccountQuery = {
      page,
      limit,
      group_name,
      global_id,
    };
    return this.zaloGroupsService.findAllByZaloAccountId(id, query);
  }

  @Get(':id/accounts')
  findLinkedAccountsByGroupId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.zaloGroupsService.findLinkedAccountsByGroupId(id);
  }

  @Post()
  create(@Body() dto: UpsertZaloGroupDto) {
    return this.zaloGroupsService.create(dto);
  }

  @Post('bulk/:id')
  async createMultiple(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateMultipleZaloGroupsDto,
  ): Promise<CreateMultipleZaloGroupsResult> {
    const result: CreateMultipleZaloGroupsResult =
      await this.zaloGroupsService.createMultiple(id, dto);

    return result;
  }

  /**
   * Rename on Zalo (`changeGroupName`) and update `ZaloGroup` in DB.
   */
  @Patch(':id/group-name')
  changeGroupName(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ChangeZaloGroupNameDto,
  ) {
    return this.zaloGroupsService.changeGroupNameOnZalo(id, dto);
  }

  /**
   * Fetch live Zalo group metadata (`getGroupInfo`) using a logged-in session.
   * Pair with `GET /zalo/actions/groups?sessionId=...` to list grid ids first.
   */
  @Post('group-info')
  getGroupInfo(@Body() dto: GetZaloGroupInfoDto) {
    return this.zaloGroupsService.getGroupInfo(dto);
  }

  @Post('invite-member')
  inviteMemberToGroup(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: InviteMemberToZaloGroupDto,
  ) {
    return this.zaloGroupsService.inviteMemberToGroup(dto, user.id);
  }

  @Post('remove-member')
  removeMemberFromGroup(@Body() dto: RemoveMemberFromZaloGroupDto) {
    return this.zaloGroupsService.removeMemberFromGroup(dto);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpsertZaloGroupDto,
  ) {
    return this.zaloGroupsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.zaloGroupsService.remove(id);
  }
}
