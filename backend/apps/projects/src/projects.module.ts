import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'devuser',
      password: 'devpassword',
      database: 'devdb',
      entities: [Project, Task],
      synchronize: true, // Set to false in production!
    }),
    TypeOrmModule.forFeature([Project]),
    TasksModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
})
export class ProjectsModule {}
