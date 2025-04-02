import { Injectable } from '@nestjs/common';
import { Project } from './project.entity';
import { ProjectsRepository } from './projects.repository';
import { GetProjectsDto } from '@app/shared/dto/get-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async getAllProjects(getProjectsDto: GetProjectsDto): Promise<Project[]> {
    return this.projectsRepository.getAllProjects(getProjectsDto);
  }
}
