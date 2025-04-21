import { DynamicModule, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigRootModule } from '@app/shared/config/src/config.module';

/**
 * Database module for connecting to PostgreSQL
 *
 * This module is responsible for database connections across all microservices
 * and provides a consistent configuration approach.
 */
@Module({})
export class DatabaseModule {
  private static readonly logger = new Logger('DatabaseModule');

  /**
   * Create a database connection with the specified entities
   * @param entities Array of entity classes to be registered with TypeORM
   * @returns A dynamic module
   */
  static forEntities(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigRootModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const host = configService.get<string>('DB_HOST');
            const port = configService.get<number>('DB_PORT');
            const username = configService.get<string>('DB_USERNAME');
            const password = configService.get<string>('DB_PASSWORD');
            const database = configService.get<string>('DB_DATABASE');

            this.logger.log(
              `Connecting to database ${database} at ${host}:${port}`,
            );

            return {
              type: 'postgres',
              host,
              port,
              username,
              password,
              database,
              entities,
              synchronize: process.env.NODE_ENV !== 'production',
              logging: process.env.NODE_ENV !== 'production',
              ssl:
                process.env.DB_SSL === 'true'
                  ? {
                      rejectUnauthorized: false,
                    }
                  : undefined,
              retryAttempts: 10,
              retryDelay: 3000,
              autoLoadEntities: false,
            };
          },
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
