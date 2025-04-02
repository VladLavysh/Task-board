import { Injectable } from '@nestjs/common';
import { Project } from './project.entity';
import { DataSource, Repository } from 'typeorm';
import { GetProjectsDto } from '@app/shared/dto/get-projects.dto';

@Injectable()
export class ProjectsRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async getAllProjects(getProjectsDto: GetProjectsDto): Promise<Project[]> {
    return this.find();
  }
}
