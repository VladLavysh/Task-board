import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL')!,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    // Pass the profile to the auth microservice for validation/creation
    this.authService.validateGithubUser(profile).subscribe({
      next: (user) => {
        // Once we have the user from auth service, generate token
        this.authService
          .generateToken({
            userId: user.id,
            email: user.email,
          })
          .subscribe({
            next: (tokenResult) => {
              // Add token to user object for the callback handler
              const userWithToken = {
                ...user,
                access_token: tokenResult.access_token,
              };
              done(null, userWithToken);
            },
            error: (error) => done(error, false),
          });
      },
      error: (error) => done(error, false),
    });
  }
}
