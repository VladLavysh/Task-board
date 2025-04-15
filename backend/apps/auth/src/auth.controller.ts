import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@app/shared/entities/user.entity';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() loginUserDto: SignInAuthDto): Promise<User> {
    return this.authService.signIn(loginUserDto);
  }

  @Post('sign-out')
  async logout(@Body('userId') userId: string): Promise<void> {
    return this.authService.signOut(userId);
  }
}
