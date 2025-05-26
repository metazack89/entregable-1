import 'dotenv/config';
import * as env from 'env-var';
import { Secret } from 'jsonwebtoken';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    NODE_ENV: env.get('NODE_ENV').required().asString(),

    // Database
    DATABASE_HOST: env.get('DATABASE_HOST').required().asString(),
    DATABASE_PORT: env.get('DATABASE_PORT').required().asPortNumber(),
    DATABASE_USERNAME: env.get('DATABASE_USERNAME').required().asString(),
    DATABASE_PASSWORD: env.get('DATABASE_PASSWORD').required().asString(),
    DATABASE_NAME: env.get('DATABASE_NAME').required().asString(),

    // JWT
    JWT_KEY: env.get('JWT_SECRET').required().asString() as Secret,
    JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('12h').asString(),

    // Bcrypt
    BCRYPT_ROUNDS: env.get('BCRYPT_ROUNDS').default(10).asInt(),
};
