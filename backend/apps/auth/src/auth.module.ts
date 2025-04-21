import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from '@app/shared/entities/user.entity';
import { ConfigRootModule } from '@app/shared/config/src/config.module';
import { DatabaseModule } from '@app/shared/database/src/database.module';
import { SERVICES } from '@app/shared';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    ConfigRootModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    DatabaseModule.forEntities([User]),
    JwtModule.registerAsync({
      imports: [ConfigRootModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRATION') || '1h',
        },
      }),
    }),
    ClientsModule.register([
      {
        name: SERVICES.USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USERS_SERVICE_PORT || '3003', 10),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class AuthModule {}
