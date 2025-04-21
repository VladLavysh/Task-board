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
import { ProjectService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from '@app/shared';
import { GetProjectsDto } from '@app/shared/dto/project.dto';
import { JwtAuthGuard } from '@apps/api-gateway/src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@apps/api-gateway/src/modules/auth/decorators/current-user.decorator';
import { Roles } from '@apps/api-gateway/src/modules/auth/decorators/roles.decorator';
import { UserRole } from '@app/shared/enums/userRole.enum';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getAllProjects(@Query() query: GetProjectsDto) {
    return this.projectService.getAllProjects(query);
  }

  @Get(':id')
  getProject(@Param('id') id: string) {
    return this.projectService.getProject(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: { userId: string; email: string; role: UserRole },
  ) {
    if (user.role === UserRole.GUEST) {
      throw new ForbiddenException('Guest users cannot create projects');
    }

    console.log(`Project created by user: ${user.email} (${user.userId})`);
    return this.projectService.createProject(createProjectDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
