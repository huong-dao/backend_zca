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
import { FindZaloGroupsDto } from './dto/find-zalo-groups.dto';
import { UpsertZaloGroupDto } from './dto/upsert-zalo-group.dto';
import { ZaloGroupsService } from './zalo-groups.service';

@Roles('ADMIN')
@Controller('zalo-groups')
export class ZaloGroupsController {
  constructor(private readonly zaloGroupsService: ZaloGroupsService) {}

  @Get()
  findAll(@Query() query: FindZaloGroupsDto) {
    return this.zaloGroupsService.findAll(query);
  }

  @Post()
  create(@Body() dto: UpsertZaloGroupDto) {
    return this.zaloGroupsService.create(dto);
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
