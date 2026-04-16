import { Body, Controller, Get, Put } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateMessageIntervalDto } from './dto/update-message-interval.dto';
import { ConfigsService } from './configs.service';

@Roles('ADMIN')
@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Get()
  findAll() {
    return this.configsService.findAll();
  }

  @Put('message-interval')
  updateMessageInterval(@Body() dto: UpdateMessageIntervalDto) {
    return this.configsService.updateMessageInterval(dto);
  }
}
