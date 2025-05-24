import { Router } from 'express';
import { UsersRoutes } from './users/routes';
import { PetPostRoutes } from './pet-post/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // API Routes
        router.use('/api/users', UsersRoutes.routes);
        router.use('/api/pet-posts', PetPostRoutes.routes);

        // Health check
        router.get('/health', (req, res) => {
            res.status(200).json({
                message: 'API is running',
                timestamp: new Date().toISOString()
            });
        });

        return router;
    }
}