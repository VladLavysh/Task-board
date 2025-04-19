import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { User } from '@app/shared/entities/user.entity';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() signInAuthDto: SignInAuthDto): Observable<User> {
    return this.authService.signIn(signInAuthDto);
  }

  @Post('sign-out')
  signOut(@Body('userId') userId: string): Observable<void> {
    return this.authService.signOut(userId);
  }
}
