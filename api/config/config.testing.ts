import * as path from 'path';
import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';


const config: DeepPartial<Config> = {
  env: Environment.TESTING,
  web: {
    port: 4001,
    routes: {
      cors: {
        origin: ['http://localhost:3000'],
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL_TESTING,
    seeds: {
      directory: path.resolve(process.cwd(), 'database', 'data', 'seed', 'testing'),
    },
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_TESTING,
  },
  auth: {
    standard: {
      cookie: {
        options: {
          isSecure: false,
        },
      },
    },
  },
};

export default config;
