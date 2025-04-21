import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '@app/shared/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@app/shared/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(id: string): Promise<User> {
    return this.usersRepository.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.getUserByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.createUser(createUserDto);
  }

  async updateUser(updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    const { id, ...payload } = updateUserDto;
    return this.usersRepository.updateUser(id!, payload!);
  }
}
