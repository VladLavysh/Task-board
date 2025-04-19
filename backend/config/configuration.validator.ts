import * as Joi from 'joi';
import { ConfigModuleOptions } from '@nestjs/config';

// Define validation schema for environment variables
export const configValidationSchema = Joi.object({
  // Database
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNC: Joi.boolean().default(false),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.number().default(3600),

  // Application
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  API_PREFIX: Joi.string().default('api'),

  // Microservices
  AUTH_SERVICE_HOST: Joi.string().default('localhost'),
  AUTH_SERVICE_PORT: Joi.number().default(3001),
  PROJECTS_SERVICE_HOST: Joi.string().default('localhost'),
  PROJECTS_SERVICE_PORT: Joi.number().default(3002),
  USERS_SERVICE_HOST: Joi.string().default('localhost'),
  USERS_SERVICE_PORT: Joi.number().default(3003),
  API_GATEWAY_PORT: Joi.number().default(3000),
});

// Configuration options for ConfigModule
export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  isGlobal: true,
  validationSchema: configValidationSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: false,
  },
  expandVariables: true,
};
