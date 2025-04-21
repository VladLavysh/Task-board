import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application configuration
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string(),
  API_PREFIX: Joi.string().default('/api'),

  // Database configuration
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_TYPE: Joi.string()
    .valid('postgres', 'mysql', 'sqlite')
    .default('postgres'),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // JWT configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),

  // Google OAuth configuration
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),

  // GitHub OAuth configuration
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CALLBACK_URL: Joi.string().required(),

  // Microservice configuration
  API_GATEWAY_HOST: Joi.string().default('localhost'),
  API_GATEWAY_PORT: Joi.number().default(3000),
  AUTH_SERVICE_HOST: Joi.string().default('localhost'),
  AUTH_SERVICE_PORT: Joi.number().default(3001),
  PROJECTS_SERVICE_HOST: Joi.string().default('localhost'),
  PROJECTS_SERVICE_PORT: Joi.number().default(3002),
  USER_SERVICE_HOST: Joi.string().default('localhost'),
  USER_SERVICE_PORT: Joi.number().default(3003),
});
