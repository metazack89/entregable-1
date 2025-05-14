import { DataSource } from 'typeorm';
import { envs } from '../../config';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';

export const appDataSource = new DataSource({
    type: 'postgres',
    host: envs.DB_HOST,
    port: envs.DB_PORT,
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    ssl: envs.DB_SSL,
    synchronize: true, 
    logging: true,
    entities: [User, PetPost],
    subscribers: [],
    migrations: [],
});