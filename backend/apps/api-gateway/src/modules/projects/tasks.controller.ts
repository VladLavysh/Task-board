import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  GetTasksDto,
  UpdateTaskDto,
} from '@app/shared/dto/task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@app/shared/enums/userRole.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('projects/:projectId/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Param('projectId') projectId: string,
    @Query() query: GetTasksDto,
  ) {
    return this.tasksService.getAllTasks(projectId, query);
  }

  @Get(':id')
  getTask(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.USER)
  createTask(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: { userId: string; email: string; role: UserRole },
  ) {
    if (user.role === UserRole.GUEST) {
      throw new ForbiddenException('Guest users cannot create tasks');
    }

    console.log(`Task created by user: ${user.email} (${user.userId})`);
    return this.tasksService.createTask(projectId, createTaskDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: { userId: string; email: string; role: UserRole },
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  deleteTask(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string; role: UserRole },
  ) {
    if (user.role === UserRole.USER) {
      // In a real application, you would check if the user is the task owner
      console.log(
        `Task deletion attempt by user: ${user.email} (${user.userId})`,
      );
    }

    return this.tasksService.deleteTask(id);
  }
}
