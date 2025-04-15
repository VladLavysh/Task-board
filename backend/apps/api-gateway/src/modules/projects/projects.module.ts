import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICES } from '@app/shared';
import { ProjectController } from './projects.controller';
import { ProjectService } from './projects.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SERVICES.PROJECT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [ProjectController, TasksController],
  providers: [ProjectService, TasksService],
})
export class ProjectsModule {}
