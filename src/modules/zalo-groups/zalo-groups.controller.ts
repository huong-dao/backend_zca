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

  @Post()
  create(@Body() dto: UpsertZaloGroupDto) {
    return this.zaloGroupsService.create(dto);
  }

  @Post('bulk')
  async createMultiple(
    @Body() dto: CreateMultipleZaloGroupsDto,
  ): Promise<CreateMultipleZaloGroupsResult> {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
    const result: CreateMultipleZaloGroupsResult =
      await this.zaloGroupsService.createMultiple(dto);
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

    return result;
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
