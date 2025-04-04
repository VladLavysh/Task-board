import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PROJECT_MESSAGE_PATTERNS, SERVICES } from '@app/shared';
import { CreateProjectDto, UpdateProjectDto } from '@app/shared';
import { GetProjectsDto } from '@app/shared/dto/project.dto';
import { Project } from '@app/shared/interfaces/project.interface';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(SERVICES.PROJECT_SERVICE) private projectClient: ClientProxy,
  ) {}

  getAllProjects(query: GetProjectsDto) {
    return this.projectClient.send<Project[]>(
      PROJECT_MESSAGE_PATTERNS.GET_ALL,
      query,
    );
  }

  getProject(id: string) {
    return this.projectClient.send(PROJECT_MESSAGE_PATTERNS.GET_ONE, id);
  }

  createProject(createProjectDto: CreateProjectDto) {
    return this.projectClient.send(
      PROJECT_MESSAGE_PATTERNS.CREATE,
      createProjectDto,
    );
  }

  updateProject(id: string, updateProjectDto: UpdateProjectDto) {
    return this.projectClient.send(PROJECT_MESSAGE_PATTERNS.UPDATE, {
      id,
      updateProjectDto,
    });
  }

  deleteProject(id: string) {
    return this.projectClient.send(PROJECT_MESSAGE_PATTERNS.DELETE, id);
  }
}
