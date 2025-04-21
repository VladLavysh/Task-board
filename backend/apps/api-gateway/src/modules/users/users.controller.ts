import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'apps/users/src/user.entity';
import { CreateUserDto } from '@app/shared/dto/user.dto';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@app/shared/enums/userRole.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUser(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string; role: UserRole },
  ): Observable<User> {
    // Users can access their own profile or admins can access any profile
    if (id === user.userId || user.role === UserRole.ADMIN) {
      return this.usersService.getUser(id);
    }
    throw new Error('Unauthorized: You can only access your own profile');
  }

  @Post()
  @Roles(UserRole.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto): Observable<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @CurrentUser() user: { userId: string; email: string; role: UserRole },
  ): Observable<User> {
    // Users can update their own profile or admins can update any profile
    if (id === user.userId || user.role === UserRole.ADMIN) {
      return this.usersService.updateUser(id, updateUserDto);
    }
    throw new Error('Unauthorized: You can only update your own profile');
  }
}
