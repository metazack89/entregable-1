import express from 'express';
import cors from 'cors';
import { AppRoutes } from '../presentation/routes';
import { PostgresDatabase } from '../data/postgres/postgres-database';
// import { config } from 'process';
// declare global {
//     namespace Express {
//         interface Request {
//             user?: {
//                 id: any;
//                 userId: number;
//                 email: string;
//                 role: string;
//             };
//         }
//     }
// }

export class Server {
    private readonly app: express.Application;
    private readonly port: number;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || 3000;

        this.middlewares();
        this.routes();
        this.database();
    }

    private middlewares() {
        // CORS
        this.app.use(cors());

        // Parseo del body
        this.app.use(express.json());

        // Logging
        this.app.use((req, res, next) => {
            console.log(`${req.method} ${req.url}`);
            next();
        });
    }

    private routes() {
        this.app.use('/api', AppRoutes.routes);
    }

    private async database() {
        try {
            await PostgresDatabase.initialize();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    // Sincronizar modelos con la base de datos
    // En producción, deberías usar migraciones en lugar de sync



    public start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
