import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_MESSAGE_PATTERNS, SERVICES } from '@app/shared';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { User } from '@app/shared/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(SERVICES.AUTH_SERVICE) private authClient: ClientProxy) {}

  signIn(signInAuthDto: SignInAuthDto): Observable<User> {
    return this.authClient.send<User>(
      AUTH_MESSAGE_PATTERNS.LOGIN,
      signInAuthDto,
    );
  }

  signOut(userId: string): Observable<void> {
    return this.authClient.send<void>(AUTH_MESSAGE_PATTERNS.LOGOUT, userId);
  }
}
