import { Server } from './server';
import { appDataSource } from './data/postgres/postgres-database';
import { envs } from './config';

// Función principal para iniciar la aplicación
(async () => {
    try {
        // Inicializar la conexión a la base de datos
        await appDataSource.initialize();
        console.log('Database initialized');

        // Crear y iniciar el servidor
        const server = new Server(envs.PORT);
        server.start();

    } catch (error) {
        console.error('Error initializing app:', error);
    }
})();