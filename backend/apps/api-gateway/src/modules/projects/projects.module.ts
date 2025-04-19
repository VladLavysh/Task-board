import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SERVICES } from '@app/shared';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICES.PROJECT_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('microservices.projects.host'),
            port: configService.get('microservices.projects.port'),
          },
        }),
      },
    ]),
  ],
  controllers: [ProjectController, TasksController],
  providers: [ProjectService, TasksService],
})
export class ProjectsModule {}
