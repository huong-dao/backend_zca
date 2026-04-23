import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { AddChildAccountDto } from './dto/add-child-account.dto';
import { CreateZaloAccountDto } from './dto/create-zalo-account.dto';
import { CreateZaloAccountFriendDto } from './dto/create-zalo-account-friend.dto';
import { FilterZaloAccountsDto } from './dto/filter-zalo-accounts.dto';
import type {
  RemovedZaloAccountFriendResult,
  UpdatedZaloAccountFriendStatusResult,
} from './zalo-accounts.service';
import { ZaloAccountsService } from './zalo-accounts.service';
import { SearchZaloAccountsDto } from './dto/search.dto';
import { UpdateGroupDataDto } from './dto/update-zalo-account-group-data';

@Roles('ADMIN', 'USER')
@Controller('zalo-accounts')
export class ZaloAccountsController {
  constructor(private readonly zaloAccountsService: ZaloAccountsService) {}

  @Post()
  create(@Body() dto: CreateZaloAccountDto) {
    return this.zaloAccountsService.create(dto);
  }

  @Get()
  findAll() {
    return this.zaloAccountsService.findAll();
  }

  @Get('filter')
  filterByType(@Query() dto: FilterZaloAccountsDto) {
    return this.zaloAccountsService.filterByType(dto);
  }

  @Post('search')
  search(@Body() dto: SearchZaloAccountsDto) {
    return this.zaloAccountsService.search(dto);
  }

  @Post('make-friend')
  createFriend(@Body() dto: CreateZaloAccountFriendDto) {
    return this.zaloAccountsService.createFriend(dto);
  }

  @Patch('approve-friend')
  async approveFriend(
    @Body() dto: CreateZaloAccountFriendDto,
  ): Promise<UpdatedZaloAccountFriendStatusResult> {
    return await this.zaloAccountsService.approveFriend(dto);
  }

  @Patch('cancel-friend')
  async cancelFriend(
    @Body() dto: CreateZaloAccountFriendDto,
  ): Promise<UpdatedZaloAccountFriendStatusResult> {
    return await this.zaloAccountsService.cancelFriend(dto);
  }

  @Delete('un-friend')
  async removeFriend(
    @Body() dto: CreateZaloAccountFriendDto,
  ): Promise<RemovedZaloAccountFriendResult> {
    return await this.zaloAccountsService.removeFriend(dto);
  }

  @Delete(':id')
  softDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.zaloAccountsService.softDelete(id);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.zaloAccountsService.findOne(id);
  }

  @Patch(':id/group-data')
  updateGroupDataById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupDataDto,
  ) {
    return this.zaloAccountsService.updateGroupDataById(id, dto);
  }

  @Post('add-child')
  addChild(@Body() dto: AddChildAccountDto) {
    return this.zaloAccountsService.addChild(dto);
  }

  @Put('set-master/:id')
  setMaster(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.zaloAccountsService.setMaster(id);
  }
}
