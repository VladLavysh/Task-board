import { Injectable } from '@nestjs/common';
import { Project } from './project.entity';
import { ProjectsRepository } from './projects.repository';
import {
  CreateProjectDto,
  GetProjectsDto,
  UpdateProjectDto,
} from '@app/shared/dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async getAllProjects(getProjectsDto: GetProjectsDto): Promise<Project[]> {
    return this.projectsRepository.getAllProjects(getProjectsDto);
  }

  async getProject(id: string): Promise<Project> {
    return this.projectsRepository.getProject(id);
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsRepository.createProject(createProjectDto);
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectsRepository.updateProject(id, updateProjectDto);
  }

  async deleteProject(id: string): Promise<string> {
    return this.projectsRepository.deleteProject(id);
  }
}
