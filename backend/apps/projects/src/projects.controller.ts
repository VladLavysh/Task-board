import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateProjectDto,
  GetProjectsDto,
  UpdateProjectDto,
} from '@app/shared/dto/project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { PROJECT_MESSAGE_PATTERNS } from '@app/shared';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern(PROJECT_MESSAGE_PATTERNS.GET_ALL)
  async getAllProjects(getProjectsDto: GetProjectsDto): Promise<Project[]> {
    return this.projectsService.getAllProjects(getProjectsDto);
  }

  @MessagePattern(PROJECT_MESSAGE_PATTERNS.GET_ONE)
  async getProject(id: string): Promise<Project> {
    return this.projectsService.getProject(id);
  }

  @MessagePattern(PROJECT_MESSAGE_PATTERNS.CREATE)
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }

  @MessagePattern(PROJECT_MESSAGE_PATTERNS.UPDATE)
  async updateProject(payload: {
    id: string;
    updateProjectDto: UpdateProjectDto;
  }): Promise<Project> {
    const { id, updateProjectDto } = payload;
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @MessagePattern(PROJECT_MESSAGE_PATTERNS.DELETE)
  async deleteProject(id: string): Promise<string> {
    return this.projectsService.deleteProject(id);
  }
}
