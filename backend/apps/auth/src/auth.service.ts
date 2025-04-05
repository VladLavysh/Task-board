import { Injectable } from '@nestjs/common';
import { User } from '../../users/src/user.entity';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signIn(loginUserDto: SignInAuthDto): Promise<User> {
    return await this.authRepository.validateUser(loginUserDto);
  }

  async signOut(userId: string): Promise<void> {
    // Implement logout logic here, such as invalidating tokens or sessions
    console.log(`User with ID ${userId} logged out`);
  }
}
