import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateMultipleZaloGroupsDto } from './dto/create-multiple-zalo-groups.dto';
import type { CreateMultipleZaloGroupsResult } from './dto/create-multiple-zalo-groups-result.dto';
import { FindZaloGroupsDto } from './dto/find-zalo-groups.dto';
import { InviteMemberToZaloGroupDto } from './dto/invite-member-to-zalo-group.dto';
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
    @Query() query: FindZaloGroupsDto,
  ) {
    return this.zaloGroupsService.findAllByZaloAccountId(id, query);
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

  @Post('invite-member')
  inviteMemberToGroup(@Body() dto: InviteMemberToZaloGroupDto) {
    return this.zaloGroupsService.inviteMemberToGroup(dto);
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
