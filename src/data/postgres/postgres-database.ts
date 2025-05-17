import { DataSource } from 'typeorm';
import { envs } from '../../config';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';

export const appDataSource = new DataSource({
    type: 'postgres',
    host: envs.PGHOST,
    port: envs.PGPORT,
    username: envs.PGUSER,
    password: envs.PGPASSWORD,
    database: envs.PGDATABASE,
    ssl: envs.PGSSL ? { rejectUnauthorized: false } : false,
    synchronize: true,
    logging: true,
    entities: [User, PetPost],
    subscribers: [],
    migrations: [],
});