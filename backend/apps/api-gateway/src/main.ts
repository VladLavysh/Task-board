import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const apiPrefix = configService.get('app.apiPrefix');

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    }),
  );

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  Logger.log(
    `API Gateway is running on port: ${port} with prefix: ${apiPrefix}`,
    'Bootstrap',
  );
}
bootstrap();
