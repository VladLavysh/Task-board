import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ProjectsModule } from './projects.module';
import { AllExceptionsFilter } from './filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectsModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    },
  );

  // Apply the global exception filter for the microservice
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen();
  console.log('Projects microservice is running on port: 3001');
}
bootstrap();
