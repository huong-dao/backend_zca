import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Roles('ADMIN')
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get()
  findAll() {
    return this.apiKeysService.findAll();
  }

  @Post()
  create(@Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.create(dto);
  }
}
