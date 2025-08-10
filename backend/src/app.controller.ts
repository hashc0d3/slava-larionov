import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('greeting')
  getGreeting() {
    return { message: 'Привет с бэкенда!' };
  }
}