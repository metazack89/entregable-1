import { Router } from 'express';
import { UsersRoutes } from './presentation/users/routes';
import { PetPostsRoutes } from './presentation/pet-post/routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        // Definir rutas principales
        router.use('/api/users', UsersRoutes.routes);
        router.use('/api/pet-posts', PetPostsRoutes.routes);

        return router;
    }
}