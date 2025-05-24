import { Router } from 'express';
import { UsersController } from './controller';
import { RegisterUserService } from './services/register-user.service';
import { LoginUserService } from './services/login-user.service';
import { FinderUserService } from './services/finder-user.service';
import { UpdaterUserService } from './services/updater-user.service';
import { EliminatorUserService } from './services/eliminator-user.service';
import { authMiddleware } from '../middleware/auth.middleware';

export class UsersRoutes {
    static get routes(): Router {
        const router = Router();

        // Initialize services
        const registerUserService = new RegisterUserService();
        const loginUserService = new LoginUserService();
        const finderUserService = new FinderUserService();
        const updaterUserService = new UpdaterUserService();
        const eliminatorUserService = new EliminatorUserService();

        // Initialize controller with dependency injection
        const usersController = new UsersController(
            registerUserService,
            loginUserService,
            finderUserService,
            updaterUserService,
            eliminatorUserService
        );

        // Public routes (no authentication required)
        router.post('/register', usersController.register);
        router.post('/login', usersController.login);

        // Protected routes (authentication required)
        router.use(authMiddleware.validateToken);

        // Get all users - Admin only
        router.get('/', authMiddleware.requireAdmin, usersController.getUsers);

        // Get user by ID - Owner or Admin
        router.get('/:id', authMiddleware.requireOwnerOrAdmin, usersController.getUserById);

        // Update user - Owner or Admin
        router.put('/:id', authMiddleware.requireOwnerOrAdmin, usersController.updateUser);

        // Delete user - Admin only
        router.delete('/:id', authMiddleware.requireAdmin, usersController.deleteUser);

        return router;
    }
}