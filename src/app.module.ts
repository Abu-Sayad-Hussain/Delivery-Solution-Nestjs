import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DeliveryModule } from './delivery/delivery.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module';
import { mongoConfig } from './config/mongo.config';
import { RedisModule } from 'nestjs-redis';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      expandVariables: false,
    }),
    RedisModule.forRootAsync({
      useFactory: async () => redisConfig,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => mongoConfig,
    }),
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
