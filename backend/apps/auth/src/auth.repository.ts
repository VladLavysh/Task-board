import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '@app/shared/entities/user.entity';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // This repository is mainly used for token blacklisting if implemented
  // Most authentication is handled through the Auth service
}
