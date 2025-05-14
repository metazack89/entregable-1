import { Request, Response } from 'express';
import { RegisterUserService } from './services/register-user.service';
import { FinderUsersService } from './services/finder-users.service';
import { FinderUserService } from './services/finder-user.service';
import { UpdaterUserService } from './services/updater-user.service';
import { EliminatorUserService } from './services/eliminator-user.service';
import { LoginUserService } from './services/login-user.service';
import { CreateUserDto } from '../../domain/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../domain/dtos/users/update.post.dto';

export class UsersController {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly finderUsersService: FinderUsersService,
        private readonly finderUserService: FinderUserService,
        private readonly updaterUserService: UpdaterUserService,
        private readonly eliminatorUserService: EliminatorUserService,
        private readonly loginUserService: LoginUserService
    ) { }

    public getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.finderUsersService.execute();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public getUserById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const user = await this.finderUserService.execute(id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public createUser = async (req: Request, res: Response) => {
        try {
            const createUserDto = req.body as CreateUserDto;
            const user = await this.registerUserService.execute(createUserDto);
            return res.status(201).json(user);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public updateUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updateUserDto = req.body as UpdateUserDto;

            const updatedUser = await this.updaterUserService.execute(id, updateUserDto);

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(updatedUser);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await this.eliminatorUserService.execute(id);

            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public loginUser = async (req: Request, res: Response) => {

        return res.status(501).json({ message: 'not yet implemented' });
    };
}