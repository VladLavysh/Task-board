import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';
import { AllExceptionsFilter } from './filters/rpc-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // First create the app without initializing the microservice
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);
  const port = configService.get('microservices.users.port');

  // Close the initial app
  await app.close();

  // Create the microservice with the configuration
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: port,
      },
    });

  // Apply the global exception filter for the microservice
  microservice.useGlobalFilters(new AllExceptionsFilter());

  await microservice.listen();
  Logger.log(`Users microservice is running on port: ${port}`, 'Bootstrap');
}
bootstrap();
