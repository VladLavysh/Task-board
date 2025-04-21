import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    // Pass the profile to the auth microservice for validation/creation
    this.authService.validateGoogleUser(profile).subscribe({
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
