import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@app/shared';
import { USER_MESSAGE_PATTERNS } from '@app/shared';
import { User } from 'apps/users/src/user.entity';
import { CreateUserDto } from '@app/shared/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SERVICES.USER_SERVICE) private usersClient: ClientProxy,
  ) {}

  getUser(id: string) {
    return this.usersClient.send<User>(USER_MESSAGE_PATTERNS.GET_ONE, id);
  }

  createUser(createUserDto: CreateUserDto) {
    return this.usersClient.send<User>(
      USER_MESSAGE_PATTERNS.CREATE,
      createUserDto,
    );
  }

  updateUser(id: string, updateUserDto: Partial<CreateUserDto>) {
    return this.usersClient.send<User>(USER_MESSAGE_PATTERNS.UPDATE, {
      id,
      payload: updateUserDto,
    });
  }
}
