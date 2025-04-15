import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES, TASK_MESSAGE_PATTERNS } from '@app/shared';
import {
  CreateTaskDto,
  GetTasksDto,
  UpdateTaskDto,
} from '@app/shared/dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject(SERVICES.PROJECT_SERVICE) private projectClient: ClientProxy,
  ) {}

  getAllTasks(projectId: string, query: GetTasksDto) {
    return this.projectClient.send(TASK_MESSAGE_PATTERNS.GET_ALL, {
      ...query,
      projectId,
    });
  }

  getTask(id: string) {
    return this.projectClient.send(TASK_MESSAGE_PATTERNS.GET_ONE, id);
  }

  createTask(projectId: string, createTaskDto: CreateTaskDto) {
    return this.projectClient.send(TASK_MESSAGE_PATTERNS.CREATE, {
      ...createTaskDto,
      projectId,
    });
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    return this.projectClient.send(TASK_MESSAGE_PATTERNS.UPDATE, {
      id,
      updateTaskDto,
    });
  }

  deleteTask(id: string) {
    return this.projectClient.send(TASK_MESSAGE_PATTERNS.DELETE, id);
  }
}
