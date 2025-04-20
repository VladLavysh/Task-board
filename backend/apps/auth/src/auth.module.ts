import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/shared/entities/user.entity';
import { ConfigRootModule } from '@app/shared/config/src/config.module';
import { DatabaseModule } from '@app/shared/database/src/database.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    ConfigRootModule,
    TypeOrmModule.forFeature([User]),
    DatabaseModule.forEntities([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
