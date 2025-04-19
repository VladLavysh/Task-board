import { Body, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { User } from '@app/shared/entities/user.entity';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { AUTH_MESSAGE_PATTERNS } from '@app/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGIN)
  async signIn(signInAuthDto: SignInAuthDto): Promise<User> {
    return this.authService.signIn(signInAuthDto);
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGOUT)
  async signOut(userId: string): Promise<void> {
    return this.authService.signOut(userId);
  }
}
