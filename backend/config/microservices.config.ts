import { registerAs } from '@nestjs/config';

export default registerAs('microservices', () => ({
  auth: {
    host: process.env.AUTH_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.AUTH_SERVICE_PORT!, 10) || 3001,
  },
  projects: {
    host: process.env.PROJECTS_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.PROJECTS_SERVICE_PORT!, 10) || 3002,
  },
  users: {
    host: process.env.USERS_SERVICE_HOST || 'localhost',
    port: parseInt(process.env.USERS_SERVICE_PORT!, 10) || 3003,
  },
  apiGateway: {
    port: parseInt(process.env.API_GATEWAY_PORT!, 10) || 3000,
  },
}));
