import express, { Application } from 'express';
import cors from 'cors';
import { AppRoutes } from './presentation/routes';

interface Options {
    port: number;
    routes: express.Router;
}

export class App {
    public readonly app: Application = express();
    private serverListener?: any;
    private readonly port: number = 3000;
    private readonly routes: express.Router;

    constructor(options: Options) {
        const { port, routes } = options;
        this.port = port;
        this.routes = routes;
        this.configureMiddlewares();
        this.configureRoutes();
    }

    private configureMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private configureRoutes(): void {
        this.app.use(this.routes);
    }

    async start(): Promise<void> {
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    public close(): void {
        this.serverListener?.close();
    }
}