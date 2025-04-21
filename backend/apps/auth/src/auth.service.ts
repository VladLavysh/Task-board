import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { AuthRepository } from './auth.repository';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { User } from '@app/shared/entities/user.entity';
import { SERVICES, USER_MESSAGE_PATTERNS } from '@app/shared';
import { firstValueFrom, catchError, of } from 'rxjs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepo: AuthRepository,
    @Inject(SERVICES.USER_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  async validateUser(signInAuthDto: SignInAuthDto): Promise<User | null> {
    const { email, password } = signInAuthDto;

    try {
      const user = await firstValueFrom(
        this.usersClient
          .send(USER_MESSAGE_PATTERNS.GET_BY_EMAIL, email)
          .pipe(catchError(() => of(null))),
      );

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async validateOAuthUser(
    profile: any,
    provider: 'google' | 'github',
  ): Promise<User> {
    const { id, emails } = profile;
    const email = emails[0].value;

    try {
      const user = await firstValueFrom(
        this.usersClient
          .send(USER_MESSAGE_PATTERNS.GET_BY_EMAIL, email)
          .pipe(catchError(() => of(null))),
      );

      if (user) {
        return user;
      }

      const newUser = {
        username: profile.displayName || email.split('@')[0],
        email,
        password: await this.generateRandomPassword(),
        provider,
        providerId: id,
      };

      return await firstValueFrom(
        this.usersClient.send(USER_MESSAGE_PATTERNS.CREATE, newUser),
      );
    } catch (error) {
      throw new Error('Failed to validate OAuth user');
    }
  }

  private async generateRandomPassword(): Promise<string> {
    const randomPassword = Math.random().toString(36).slice(-10);
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(randomPassword, salt);
  }

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
