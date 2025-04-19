import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@app/shared/entities/user.entity';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_MESSAGE_PATTERNS } from '@app/shared';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGIN)
  async signIn(
    @Body() loginUserDto: SignInAuthDto,
  ): Promise<{ user: User; accessToken: string }> {
    return this.authService.signIn(loginUserDto);
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGOUT)
  async signOut(@Body('userId') userId: string): Promise<void> {
    return this.authService.signOut(userId);
  }
}
