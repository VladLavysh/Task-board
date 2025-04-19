import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { User } from '@app/shared/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signIn(signInAuthDto: SignInAuthDto): Promise<User> {
    try {
      return await this.authRepository.validateUser(signInAuthDto);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async signOut(userId: string): Promise<void> {
    // In a real-world application, you might want to invalidate tokens or sessions here
    console.log(`User with ID ${userId} signed out`);
  }
}
