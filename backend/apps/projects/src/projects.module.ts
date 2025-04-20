import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { Project } from './project.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { ConfigRootModule } from '@app/shared/config/src/config.module';
import { DatabaseModule } from '@app/shared/database/src/database.module';

@Module({
  imports: [
    ConfigRootModule,
    TasksModule,
    TypeOrmModule.forFeature([Project]),
    DatabaseModule.forEntities([Project, Task]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
