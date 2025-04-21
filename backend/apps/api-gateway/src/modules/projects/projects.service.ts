import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PROJECT_MESSAGE_PATTERNS, SERVICES } from '@app/shared';
import { CreateProjectDto, UpdateProjectDto } from '@app/shared';
import { GetProjectsDto } from '@app/shared/dto/project.dto';
import { Project } from '@app/shared/interfaces/project.interface';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Project service for the API Gateway
 *
 * This service handles project-related operations by communicating with the Projects microservice.
 * It provides methods for creating, reading, updating, and deleting projects.
 */
@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @Inject(SERVICES.PROJECT_SERVICE) private projectClient: ClientProxy,
  ) {}

  /**
   * Get all projects with optional filtering
   * @param query Filtering criteria
   * @returns An observable with an array of projects
   */
  getAllProjects(query: GetProjectsDto): Observable<Project[]> {
    this.logger.log(
      `Fetching all projects with filters: ${JSON.stringify(query)}`,
    );
    return this.projectClient
      .send<Project[]>(PROJECT_MESSAGE_PATTERNS.GET_ALL, query)
      .pipe(
        catchError((err) => {
          this.logger.error(`Failed to fetch projects: ${err.message}`);
          return throwError(
            () => new NotFoundException('Failed to fetch projects'),
          );
        }),
      );
  }

  /**
   * Get a single project by ID
   * @param id The project ID
   * @returns An observable with the project
   */
  getProject(id: string): Observable<Project> {
    this.logger.log(`Fetching project with ID: ${id}`);
    return this.projectClient
      .send<Project>(PROJECT_MESSAGE_PATTERNS.GET_ONE, id)
      .pipe(
        catchError((err) => {
          this.logger.error(`Failed to fetch project ${id}: ${err.message}`);
          return throwError(
            () => new NotFoundException(`Project with ID ${id} not found`),
          );
        }),
      );
  }

  /**
   * Create a new project
   * @param createProjectDto The project data
   * @returns An observable with the created project
   */
  createProject(createProjectDto: CreateProjectDto): Observable<Project> {
    this.logger.log(`Creating new project: ${createProjectDto.name}`);
    return this.projectClient.send<Project>(
      PROJECT_MESSAGE_PATTERNS.CREATE,
      createProjectDto,
    );
  }

  /**
   * Update an existing project
   * @param id The project ID
   * @param updateProjectDto The project data to update
   * @returns An observable with the updated project
   */
  updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Observable<Project> {
    this.logger.log(
      `Updating project ${id}: ${JSON.stringify(updateProjectDto)}`,
    );
    return this.projectClient.send<Project>(PROJECT_MESSAGE_PATTERNS.UPDATE, {
      id,
      updateProjectDto,
    });
  }

  /**
   * Delete a project
   * @param id The project ID
   * @returns An observable with the deleted project ID
   */
  deleteProject(id: string): Observable<string> {
    this.logger.log(`Deleting project: ${id}`);
    return this.projectClient.send(PROJECT_MESSAGE_PATTERNS.DELETE, id);
  }
}
