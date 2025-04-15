import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import {
  CreateTaskDto,
  GetTasksDto,
  UpdateTaskDto,
} from '@app/shared/dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTask(id: string): Promise<Task | null> {
    return this.tasksRepository.getTaskById(id);
  }

  async getAllTasks(getTasksDto: GetTasksDto): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(getTasksDto);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksRepository.updateTask(id, updateTaskDto);
  }

  async deleteTask(id: string): Promise<string> {
    return this.tasksRepository.deleteTask(id);
  }
}
