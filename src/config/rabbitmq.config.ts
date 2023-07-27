import { ClientOptions, Transport } from '@nestjs/microservices';

export const rabbitmqConfig: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL],

    queue: process.env.RABBITMQ_QUEUE_NAME,

    queueOptions: {
      durable: true,
    },
  },
};
