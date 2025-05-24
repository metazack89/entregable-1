import 'dotenv/config';
import * as env from 'env-var';
import { Secret } from 'jsonwebtoken';

export const envs = {
    PORT: env.get('PORT').required().asPortNumber(),
    NODE_ENV: env.get('NODE_ENV').required().asString(),

    // Database
    PG_HOST: env.get('PG_HOST').required().asString(),
    PG_PORT: env.get('PG_PORT').required().asPortNumber(),
    PG_USERNAME: env.get('PG_USERNAME').required().asString(),
    PG_PASSWORD: env.get('PG_PASSWORD').required().asString(),
    PG_DATABASE: env.get('PG_DATABASE').required().asString(),

    // JWT
    JWT_SECRET: env.get('JWT_SECRET').required().asString() as Secret, // 👈 forzar tipo compatible
    JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('24h').asString(),

    // Bcrypt
    BCRYPT_ROUNDS: env.get('BCRYPT_ROUNDS').default(10).asInt(),
};
