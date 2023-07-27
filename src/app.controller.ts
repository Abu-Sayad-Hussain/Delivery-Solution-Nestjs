import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'nestjs-redis';

@Controller()
export class AppController {
  private readonly client: ClientProxy;

  constructor(private readonly redisService: RedisService) {}

  @Get()
  @UseInterceptors(ResponseInterceptor)
  getHello(@Req() request: Request): any {
    return {
      message: 'Delivery Service',
      method: request.method,
    };
  }
}
