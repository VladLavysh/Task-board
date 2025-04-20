import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.CONFIG_PATH || '.env',
      validationSchema: configValidationSchema,
    }),
  ],
})
export class ConfigRootModule {}
