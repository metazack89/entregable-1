import { Router } from 'express';
import { PetPostsController } from './controller';
import { CreatorPetPostService } from './services/creator-pet-post.service';
import { FinderPetPostService } from './services/finder-pet-post.service';
import { UpdaterPetPostService } from './services/updater-pet-post.service';
import { EliminatorPetPostService } from './services/eliminator-pet-post.service';

export class PetPostsRoutes {
    static get routes(): Router {
        const router = Router();

        // Inyección de dependencias
        const creatorPetPostService = new CreatorPetPostService();
        const finderPetPostService = new FinderPetPostService();
        const updaterPetPostService = new UpdaterPetPostService();
        const eliminatorPetPostService = new EliminatorPetPostService();

        const controller = new PetPostsController(
            creatorPetPostService,
            finderPetPostService,
            updaterPetPostService,
            eliminatorPetPostService
        );

        router.get('/', controller.getPosts);
        router.get('/:id', controller.getPostById);
        router.post('/', controller.createPost);
        router.put('/:id', controller.updatePost);
        router.delete('/:id', controller.deletePost);
        router.put('/:id/approve', controller.approvePost);
        router.put('/:id/reject', controller.rejectPost);

        return router;
    }
}