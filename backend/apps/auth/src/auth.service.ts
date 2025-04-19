import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { User } from '@app/shared/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    loginUserDto: SignInAuthDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.authRepository.validateUser(loginUserDto);

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      user,
      accessToken,
    };
  }

  async signOut(userId: string): Promise<void> {
    // Implement logout logic here, such as invalidating tokens or sessions
    console.log(`User with ID ${userId} logged out`);
  }
}
