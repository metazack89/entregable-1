import { Router } from 'express';
import { UsersController } from './controller';
import { RegisterUserService } from './services/register-user.service';
import { FinderUsersService } from './services/finder-users.service';
import { FinderUserService } from './services/finder-user.service';
import { UpdaterUserService } from './services/updater-user.service';
import { EliminatorUserService } from './services/eliminator-user.service';
import { LoginUserService } from './services/login-user.service';

export class UsersRoutes {
    static get routes(): Router {
        const router = Router();

        const registerUserService = new RegisterUserService();
        const finderUsersService = new FinderUsersService();
        const finderUserService = new FinderUserService();
        const updaterUserService = new UpdaterUserService();
        const eliminatorUserService = new EliminatorUserService();
        const loginUserService = new LoginUserService();

        const controller = new UsersController(
            registerUserService,
            finderUsersService,
            finderUserService,
            updaterUserService,
            eliminatorUserService,
            loginUserService
        );

        router.get('/', controller.getUsers);
        router.get('/:id', controller.getUserById);
        router.post('/', controller.createUser);
        router.put('/:id', controller.updateUser);
        router.delete('/:id', controller.deleteUser);
        router.post('/login', controller.loginUser);

        return router;
    }
}