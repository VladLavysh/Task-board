import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_MESSAGE_PATTERNS,
  SERVICES,
  USER_MESSAGE_PATTERNS,
} from '@app/shared';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateUserDto } from '@app/shared/dto/user.dto';
import { User } from '@app/shared/entities/user.entity';
import { switchMap, map } from 'rxjs/operators';

/**
 * Authentication service for the API Gateway
 *
 * This service handles authentication requests by communicating with the Auth microservice.
 * It provides methods for signing in, signing out, validating OAuth users, and registering new users.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(SERVICES.AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(SERVICES.USER_SERVICE) private usersClient: ClientProxy,
  ) {}

  /**
   * Sign in a user with email and password
   * @param signInAuthDto The sign in credentials
   * @returns An observable with access token
   */
  signIn(signInAuthDto: SignInAuthDto): Observable<{ access_token: string }> {
    return this.authClient
      .send<{
        access_token: string;
      }>(AUTH_MESSAGE_PATTERNS.LOGIN, signInAuthDto)
      .pipe(
        catchError((error) => {
          this.logger.error(`Sign in failed: ${error.message}`);
          return throwError(
            () => new BadRequestException(error.message || 'Sign in failed'),
          );
        }),
      );
  }

  /**
   * Sign out a user
   * @param userId The ID of the user to sign out
   * @returns An observable with success status
   */
  signOut(userId: string): Observable<{ success: boolean }> {
    return this.authClient.send<{ success: boolean }>(
      AUTH_MESSAGE_PATTERNS.LOGOUT,
      userId,
    );
  }

  /**
   * Validate a Google OAuth user
   * @param profile The Google profile information
   * @returns An observable with the validation result
   */
  validateGoogleUser(profile: any): Observable<any> {
    return this.authClient.send(AUTH_MESSAGE_PATTERNS.VALIDATE_GOOGLE, profile);
  }

  /**
   * Validate a GitHub OAuth user
   * @param profile The GitHub profile information
   * @returns An observable with the validation result
   */
  validateGithubUser(profile: any): Observable<any> {
    return this.authClient.send(AUTH_MESSAGE_PATTERNS.VALIDATE_GITHUB, profile);
  }

  /**
   * Generate a new JWT token
   * @param payload The payload for the token
   * @returns An observable with the access token
   */
  generateToken(payload: {
    userId: string;
    email: string;
  }): Observable<{ access_token: string }> {
    return this.authClient.send<{ access_token: string }>(
      AUTH_MESSAGE_PATTERNS.REFRESH_TOKEN,
      payload,
    );
  }

  /**
   * Register a new user
   * @param createUserDto The user registration data
   * @returns An observable with the access token and user information
   */
  signUp(
    createUserDto: CreateUserDto,
  ): Observable<{ access_token: string; user: User }> {
    // Create user via user service
    return this.usersClient
      .send<User>(USER_MESSAGE_PATTERNS.CREATE, createUserDto)
      .pipe(
        catchError((error) => {
          this.logger.error(`User creation failed: ${error.message}`);
          return throwError(
            () =>
              new BadRequestException(error.message || 'Registration failed'),
          );
        }),
        switchMap((user) => {
          // Generate token for the new user via auth service
          return this.authClient
            .send<{ access_token: string }>(AUTH_MESSAGE_PATTERNS.SIGNUP, user)
            .pipe(
              map((tokenResult) => ({
                access_token: tokenResult.access_token,
                user: {
                  id: user.id,
                  email: user.email,
                  username: user.username,
                  role: user.role,
                } as User,
              })),
            );
        }),
      );
  }
}
