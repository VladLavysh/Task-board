import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@app/shared/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '@app/shared/dto/user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  private async getHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, repeatPassword, ...rest } = createUserDto;

    const existingUser = await this.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await this.getHashedPassword(password);

    const user = this.create({
      ...rest,
      email,
      password: hashedPassword,
      isActive: true,
    });
    return await this.save(user);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedData = { ...updateUserDto };

    if (updatedData.password) {
      updatedData.password = await this.getHashedPassword(updatedData.password);
    }

    const updatedUser = this.merge(user, updatedData);
    await this.save(updatedUser);

    return (await this.findOneBy({ id })) as User;
  }
}
