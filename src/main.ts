import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { logger } from './common/middlewares/logger.middleware';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, SERVICE, X-EVALY-PLATFORM',
  });
  const config = new DocumentBuilder()
    .setTitle('Delivery Service')
    .setDescription('Delivery Service API Documentation')
    .setVersion('1.0.0')
    .addTag('delivery-service')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1.0.0', app, document);

  const configService = app.get(ConfigService);
  app.use(logger);
  await app.listen(configService.get('APP_PORT'));
  console.log(
    `Application is running on: ${(await app.getUrl()).replace(
      '[::1]',
      'localhost',
    )}`,
  );
}
bootstrap();
