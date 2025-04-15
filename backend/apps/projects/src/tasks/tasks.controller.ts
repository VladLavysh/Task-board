import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateTaskDto,
  GetTasksDto,
  UpdateTaskDto,
} from '@app/shared/dto/task.dto';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { TASK_MESSAGE_PATTERNS } from '@app/shared';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern(TASK_MESSAGE_PATTERNS.GET_ALL)
  async getAllTasks(getTasksDto: GetTasksDto): Promise<Task[]> {
    return this.tasksService.getAllTasks(getTasksDto);
  }

  @MessagePattern(TASK_MESSAGE_PATTERNS.GET_ONE)
  async getTask(id: string): Promise<Task | null> {
    return this.tasksService.getTask(id);
  }

  @MessagePattern(TASK_MESSAGE_PATTERNS.CREATE)
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @MessagePattern(TASK_MESSAGE_PATTERNS.UPDATE)
  async updateTask(payload: {
    id: string;
    updateTaskDto: UpdateTaskDto;
  }): Promise<Task> {
    const { id, updateTaskDto } = payload;
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @MessagePattern(TASK_MESSAGE_PATTERNS.DELETE)
  async deleteTask(id: string): Promise<string> {
    return this.tasksService.deleteTask(id);
  }
}
