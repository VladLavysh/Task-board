import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { User } from '@app/shared';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(
    @Body() loginUserDto: SignInAuthDto,
  ): Observable<{ user: User; accessToken: string }> {
    return this.authService.signIn(loginUserDto);
  }

  @Post('sign-out')
  signOut(@Body('userId') userId: string): Observable<void> {
    return this.authService.signOut(userId);
  }
}
