import { DataSource } from 'typeorm';
import { envs } from '../../config';
import { User } from './models/user.model';
import { PetPost } from './models/pet-post.model';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: envs.PG_DATABASE,
    port: envs.PG_PORT,
    username: envs.PG_USERNAME,
    password: envs.PG_PASSWORD,
    database: envs.PG_DATABASE,
    synchronize: true,
    logging: envs.NODE_ENV === 'development',
    entities: [User, PetPost],
    ssl: envs.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class PostgresDatabase {
    static sync(arg0: { force: boolean; }) {
        throw new Error('Method not implemented.');
    }
    static connect(arg0: { host: string; port: number; username: string; password: string; database: string; }) {
        throw new Error('Method not implemented.');
    }
    static async initialize(): Promise<void> {
        try {
            await AppDataSource.initialize();
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }

    static async close(): Promise<void> {
        try {
            await AppDataSource.destroy();
            console.log('✅ Database connection closed');
        } catch (error) {
            console.error('❌ Error closing database connection:', error);
            throw error;
        }
    }
}