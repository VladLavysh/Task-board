import { Body, Controller, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '@app/shared/dto/user.dto';
import { User } from '@app/shared/entities/user.entity';
import { USER_MESSAGE_PATTERNS } from '@app/shared';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_MESSAGE_PATTERNS.GET_ONE)
  async getUser(id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.CREATE)
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @MessagePattern(USER_MESSAGE_PATTERNS.UPDATE)
  async updateUser(updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    return this.usersService.updateUser(updateUserDto);
  }
}
