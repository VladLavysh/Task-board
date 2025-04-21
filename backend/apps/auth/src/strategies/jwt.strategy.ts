import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJWTPayload } from '@app/shared/interfaces/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(
    payload: IJWTPayload,
  ): Promise<{ userId: string; email: string }> {
    const { sub, email } = payload;
    if (!sub || !email) {
      throw new Error('Invalid JWT payload');
    }

    return { userId: payload.sub, email: payload.email };
  }
}
