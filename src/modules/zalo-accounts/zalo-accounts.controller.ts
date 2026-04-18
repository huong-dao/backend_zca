import {
  Patch,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { AddChildAccountDto } from './dto/add-child-account.dto';
import { CreateZaloAccountDto } from './dto/create-zalo-account.dto';
import { UpdateGroupDataDto } from './dto/update-zalo-account-group-data';
import { ZaloAccountsService } from './zalo-accounts.service';
import { SearchZaloAccountsDto } from './dto/search.dto';

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

  @Post('search')
  search(@Body() dto: SearchZaloAccountsDto) {
    return this.zaloAccountsService.search(dto);
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
