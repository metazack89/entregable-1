import { Server } from './presentation/server';
import { appDataSource } from './data/postgres/postgres-database';
import { envs } from './config';


(async () => {
    try {

        await appDataSource.initialize();
        console.log('Database initialized');

        const server = new Server(envs.PORT);
        server.start();

    } catch (error) {
        console.error('Error initializing app:', error);
    }
})();