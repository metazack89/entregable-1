import { Router } from 'express';
import { PetPostController } from './controller';
import { CreatorPetPostService } from './services/creator-pet-post.service';
import { FinderPetPostService } from './services/finder-pet-post.service';
import { UpdaterPetPostService } from './services/updater-pet-post.service';
import { EliminatorPetPostService } from './services/eliminator-pet-post.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { creatorMiddleware } from '../middleware/creator-middleware-impl';

export class PetPostRoutes {
    static get routes(): Router {
        const router = Router();

        // Instantiate services
        const creatorPetPostService = new CreatorPetPostService();
        const finderPetPostService = new FinderPetPostService();
        const updaterPetPostService = new UpdaterPetPostService();
        const eliminatorPetPostService = new EliminatorPetPostService();

        // Instantiate controller with dependency injection
        const petPostController = new PetPostController(
            creatorPetPostService,
            finderPetPostService,
            updaterPetPostService,
            eliminatorPetPostService
        );

        // Public routes (require authentication)
        router.post('/', authMiddleware.validateToken, petPostController.create);
        router.get('/', authMiddleware.validateToken, petPostController.findAll);
        router.get('/:id', authMiddleware.validateToken, petPostController.findById);

        // Protected routes (require ownership or admin)
        router.put('/:id', authMiddleware.validateToken, creatorMiddleware.requirePostCreator, petPostController.update);
        router.delete('/:id', authMiddleware.validateToken, creatorMiddleware.requirePostCreator, petPostController.delete);

        // Admin only routes
        router.patch('/:id/approve', authMiddleware.validateToken, authMiddleware.requireAdmin, petPostController.approve);
        router.patch('/:id/reject', authMiddleware.validateToken, authMiddleware.requireAdmin, petPostController.reject);

        return router;
    }
}