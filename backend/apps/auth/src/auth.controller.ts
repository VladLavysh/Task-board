import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AUTH_MESSAGE_PATTERNS } from '@app/shared';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGIN)
  async login(signInAuthDto: SignInAuthDto) {
    const user = await this.authService.validateUser(signInAuthDto);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.signIn(user);
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.REFRESH_TOKEN)
  async refreshToken(payload: { userId: string; email: string }) {
    const user = { id: payload.userId, email: payload.email };
    return this.authService.signIn(user as any);
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.VALIDATE_GOOGLE)
  async validateGoogleUser(profile: any) {
    return this.authService.validateOAuthUser(profile, 'google');
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.VALIDATE_GITHUB)
  async validateGithubUser(profile: any) {
    return this.authService.validateOAuthUser(profile, 'github');
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.LOGOUT)
  async logout(userId: string) {
    // In JWT auth, logout is typically handled client-side by removing the token
    // No server-side action required, but we can implement if needed for token blacklisting
    return { success: true };
  }

  @MessagePattern(AUTH_MESSAGE_PATTERNS.SIGNUP)
  async signup(user: any) {
    return this.authService.signUp(user);
  }
}
