import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_MESSAGE_PATTERNS, SERVICES, User } from '@app/shared';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@Inject(SERVICES.AUTH_SERVICE) private authClient: ClientProxy) {}

  signIn(loginUserDto: SignInAuthDto) {
    return this.authClient.send<{ user: User; accessToken: string }>(
      AUTH_MESSAGE_PATTERNS.LOGIN,
      loginUserDto,
    );
  }

  signOut(userId: string) {
    return this.authClient.send<void>(AUTH_MESSAGE_PATTERNS.LOGOUT, userId);
  }
}
