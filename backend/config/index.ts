import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import microservicesConfig from './microservices.config';
import { configModuleOptions } from './configuration.validator';

export { configModuleOptions };

export default [appConfig, databaseConfig, jwtConfig, microservicesConfig];
