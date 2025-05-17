import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PGHOST: get('PGHOST').required().asString(),
    PGPORT: get('PGPORT').required().asPortNumber(),
    PGUSER: get('PGUSER').required().asString(),
    PGPASSWORD: get('PGPASSWORD').required().asString(),
    PGDATABASE: get('PGDATABASE').required().asString(),
    PGSSL: get('PGSSL').default('false').asBool(),
};