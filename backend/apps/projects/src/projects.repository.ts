import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import {
  CreateProjectDto,
  GetProjectsDto,
  UpdateProjectDto,
} from '@app/shared/dto/project.dto';
import { ProjectStatus } from '@app/shared/enums/projectStatus.enum';

@Injectable()
export class ProjectsRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async getAllProjects(getProjectsDto: GetProjectsDto): Promise<Project[]> {
    const { search, status } = getProjectsDto;
    const queryBuilder = this.createQueryBuilder('project');

    if (search) {
      queryBuilder.where('project.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    if (status) {
      queryBuilder.andWhere('project.status = :status', { status });
    }
    return queryBuilder.getMany();
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.create({
      ...createProjectDto,
      status: ProjectStatus.NOT_STARTED,
    });
    return this.save(project);
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const result = await this.update({ id }, updateProjectDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return this.getProject(id);
  }

  async deleteProject(id: string): Promise<string> {
    const result = await this.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return id;
  }
}
