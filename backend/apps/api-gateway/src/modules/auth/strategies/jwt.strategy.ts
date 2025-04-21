import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJWTPayload } from '@app/shared/interfaces/jwt.interface';
import { UsersService } from '../../users/users.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: IJWTPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Get the full user details including role information
    try {
      const user = await firstValueFrom(this.usersService.getUser(payload.sub));
      return {
        userId: payload.sub,
        email: payload.email,
        role: user.role,
      };
    } catch (error) {
      throw new UnauthorizedException('User not found');
    }
  }
}
