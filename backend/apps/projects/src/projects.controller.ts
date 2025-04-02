import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
// import { CreateProjecrtDto } from '@app/shared/dto/create-project.dto';
import { GetProjectsDto } from '@app/shared/dto/get-projects.dto';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern('projects.getAllProjects')
  async getAllProjects(getProjectsDto: GetProjectsDto): Promise<Project[]> {
    return this.projectsService.getAllProjects(getProjectsDto);
  }
}
