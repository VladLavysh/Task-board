import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '@app/shared/dto/user.dto';
import { User } from '@app/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(
    @Body() createUserDto: CreateUserDto,
  ): Observable<{ access_token: string; user: User }> {
    console.log('--- signUp', createUserDto);
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  signIn(
    @Body() signInAuthDto: SignInAuthDto,
  ): Observable<{ access_token: string }> {
    return this.authService.signIn(signInAuthDto);
  }

  @Post('sign-out')
  signOut(@Body('userId') userId: string): Observable<{ success: boolean }> {
    return this.authService.signOut(userId);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // Handle the Google OAuth2 callback
    const token = req.user.access_token;
    // Redirect to frontend with token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/oauth?token=${token}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Initiates the GitHub OAuth2 login flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubLoginCallback(@Req() req, @Res() res) {
    // Handle the GitHub OAuth2 callback
    const token = req.user.access_token;
    // Redirect to frontend with token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/oauth?token=${token}`,
    );
  }
}
