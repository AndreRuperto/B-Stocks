import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getAppInfo() {
    return {
      name: 'B-Stocks API',
      version: '1.0.0',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
