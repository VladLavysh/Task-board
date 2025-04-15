import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { GetTasksDto } from '@app/shared/dto/task.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await this.findOneBy({ id });
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  async getAllTasks(getTasksDto: GetTasksDto): Promise<Task[]> {
    const { search, status } = getTasksDto;
    const queryBuilder = this.createQueryBuilder('task');

    if (search) {
      queryBuilder.where('task.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }
    return queryBuilder.getMany();
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const task = this.create(data);
    return await this.save(task);
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await this.update(id, data);
    const updatedTask = (await this.getTaskById(id))!;
    return updatedTask;
  }

  async deleteTask(id: string): Promise<string> {
    const task = (await this.getTaskById(id)) as Task;
    const taskId = task.id;
    await this.remove(task);
    return taskId;
  }
}
