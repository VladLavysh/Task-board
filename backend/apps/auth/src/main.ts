import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: configService.get('AUTH_SERVICE_HOST', 'localhost'),
      port: parseInt(configService.get('AUTH_SERVICE_PORT', '3001')),
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(configService.get('AUTH_HTTP_PORT', 4001));
  console.log(
    `Auth Microservice is running on port ${configService.get('AUTH_SERVICE_PORT', '3001')}`,
  );
  console.log(
    `Auth HTTP server is running on port ${configService.get('AUTH_HTTP_PORT', '4001')}`,
  );
}
bootstrap();
