import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { SignInAuthDto } from '@app/shared/dto/auth.dto';
import { UsersService } from '@apps/users/src/users.service'; // make it shared?
import { User } from '@app/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepo: AuthRepository,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(signInAuthDto: SignInAuthDto): Promise<User | null> {
    const { email, password } = signInAuthDto;
    const user = await this.usersService.getUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async validateOAuthUser(
    profile: any,
    provider: 'google' | 'github',
  ): Promise<User> {
    const { id, emails } = profile;
    const email = emails[0].value;
    let user = await this.authRepo.findOne({ where: { email } });

    if (!user) {
      user = this.authRepo.create({
        provider,
        providerId: id,
        email,
      });
      await this.authRepo.save(user);
    }

    return user;
  }

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
