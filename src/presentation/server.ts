import express, { Application } from 'express';
import { AppRoutes } from './routes';

export class Server {
    private readonly app: Application;
    private readonly port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.configureMiddlewares();
        this.configureRoutes();
    }

    private configureMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private configureRoutes() {
        this.app.use(AppRoutes.routes);
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}