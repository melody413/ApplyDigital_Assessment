import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Public-App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get()
  checkHealth(): string {
    return this.appService.checkHealth();
  }
}
