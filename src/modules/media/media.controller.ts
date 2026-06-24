import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { DeleteMediaBatchDto } from './dto/delete-media-batch.dto';
import { FindMediaDto } from './dto/find-media.dto';
import { MediaService } from './media.service';

@Roles('ADMIN', 'USER')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(@Query() query: FindMediaDto) {
    return this.mediaService.findAll(query);
  }

  @Delete('batch')
  deleteBatch(@Body() dto: DeleteMediaBatchDto) {
    return this.mediaService.removeMany(dto.ids);
  }

  @Get(':id/file')
  streamFile(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mediaService.streamFile(id);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.mediaService.remove(id);
  }
}
