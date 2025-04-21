import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import {
  CreateTaskDto,
  GetTasksDto,
  UpdateTaskDto,
} from '@app/shared/dto/task.dto';

/**
 * Task service for the Projects microservice
 *
 * Handles business logic for task operations including CRUD operations
 * and validation.
 */
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly tasksRepository: TasksRepository) {}

  /**
   * Retrieve a task by its ID
   * @param id The task ID to retrieve
   * @returns The task entity or null if not found
   */
  async getTask(id: string): Promise<Task | null> {
    this.logger.debug(`Retrieving task with ID: ${id}`);
    try {
      return await this.tasksRepository.getTaskById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error retrieving task: ${error.message}`, error.stack);
      throw new Error('Error retrieving task');
    }
  }

  /**
   * Get all tasks with optional filtering
   * @param getTasksDto Filtering criteria
   * @returns Array of task entities
   */
  async getAllTasks(getTasksDto: GetTasksDto): Promise<Task[]> {
    this.logger.debug(
      `Retrieving tasks with filters: ${JSON.stringify(getTasksDto)}`,
    );
    try {
      return await this.tasksRepository.getAllTasks(getTasksDto);
    } catch (error) {
      this.logger.error(
        `Error retrieving tasks: ${error.message}`,
        error.stack,
      );
      throw new Error('Error retrieving tasks');
    }
  }

  /**
   * Create a new task
   * @param createTaskDto Task creation data
   * @returns The created task entity
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    this.logger.debug(`Creating new task: ${createTaskDto.title}`);
    try {
      return await this.tasksRepository.createTask(createTaskDto);
    } catch (error) {
      this.logger.error(`Error creating task: ${error.message}`, error.stack);
      throw new Error('Error creating task');
    }
  }

  /**
   * Update an existing task
   * @param id The task ID to update
   * @param updateTaskDto Data to update
   * @returns The updated task entity
   */
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.debug(`Updating task ${id}: ${JSON.stringify(updateTaskDto)}`);
    try {
      return await this.tasksRepository.updateTask(id, updateTaskDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating task: ${error.message}`, error.stack);
      throw new Error('Error updating task');
    }
  }

  /**
   * Delete a task
   * @param id The task ID to delete
   * @returns The ID of the deleted task
   */
  async deleteTask(id: string): Promise<string> {
    this.logger.debug(`Deleting task: ${id}`);
    try {
      return await this.tasksRepository.deleteTask(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting task: ${error.message}`, error.stack);
      throw new Error('Error deleting task');
    }
  }
}
