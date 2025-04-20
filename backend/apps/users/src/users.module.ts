import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from '@app/shared/entities/user.entity';
import { ConfigRootModule } from '@app/shared/config/src/config.module';
import { DatabaseModule } from '@app/shared/database/src/database.module';

@Module({
  imports: [
    ConfigRootModule,
    TypeOrmModule.forFeature([User]),
    DatabaseModule.forEntities([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
