import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const dbType = process.env.DB_TYPE || 'postgres';

  return {
    type: dbType,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNC === 'true',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
  };
});
