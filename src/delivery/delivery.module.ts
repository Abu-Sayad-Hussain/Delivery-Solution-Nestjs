import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpressCommonService } from './express/service/common.service';
import { EfoodCommonService } from './efood/service/common.service';
import { ExpressCommonController } from './express/controller/common.controller';
import { EfoodCommonController } from './efood/controller/common.controller';
import { DeliveryService } from './delivery.service';
import { Delivery, DeliverySchema } from './schemas/delivery.schema';
import { JoiPipeModule } from 'nestjs-joi';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ExpressConsumer } from './rabbitmq/consumers/express.consumer';
import { EfoodConsumer } from './rabbitmq/consumers/efood.consumer';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'delivery.events',
          type: 'topic',
          options: {
            durable: true,
          },
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Delivery.name,
        useFactory: () => {
          return DeliverySchema;
        },
      },
    ]),
    JoiPipeModule,
  ],
  controllers: [ExpressCommonController, EfoodCommonController],
  providers: [DeliveryService, ExpressCommonService, EfoodCommonService, ExpressConsumer, EfoodConsumer],
})
export class DeliveryModule {}