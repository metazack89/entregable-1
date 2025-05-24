import { Request, Response } from 'express';
import { RegisterUserService } from './services/register-user.service';
import { LoginUserService } from './services/login-user.service';
import { FinderUserService } from './services/finder-user.service';
import { UpdaterUserService } from './services/updater-user.service';
import { EliminatorUserService } from './services/eliminator-user.service';
import { CreateUserDtoValidator } from '../../domain/dtos/users/create-user.dto';
import { UpdateUserDtoValidator } from '../../domain/dtos/users/update-user.dto';
import { z } from 'zod';

export class UsersController {
    constructor(
        private readonly registerUserService: RegisterUserService,
        private readonly loginUserService: LoginUserService,
        private readonly finderUserService: FinderUserService,
        private readonly updaterUserService: UpdaterUserService,
        private readonly eliminatorUserService: EliminatorUserService
    ) { }

    register = async (req: Request, res: Response) => {
        try {
            const createUserDto = CreateUserDtoValidator.validate(req.body);
            const result = await this.registerUserService.execute(createUserDto);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors
                });
            }

            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed'
            });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.loginUserService.execute(req.body);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error instanceof Error ? error.message : 'Login failed'
            });
        }
    };

    getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.finderUserService.findAll();

            res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching users'
            });
        }
    };

    getUserById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const user = await this.finderUserService.findById(id);

            res.status(200).json({
                success: true,
                message: 'User retrieved successfully',
                data: user
            });
        } catch (error) {
            const status = error instanceof Error && error.message === 'User not found' ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching user'
            });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const updateUserDto = UpdateUserDtoValidator.validate(req.body);
            const updatedUser = await this.updaterUserService.execute(id, updateUserDto);

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.errors
                });
            }

            const status = error instanceof Error && error.message === 'User not found' ? 404 : 400;

            res.status(status).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error updating user'
            });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user ID'
                });
            }

            const result = await this.eliminatorUserService.execute(id);

            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedUserId: result.deletedUserId }
            });
        } catch (error) {
            const status = error instanceof Error && error.message === 'User not found' ? 404 : 500;

            res.status(status).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error deleting user'
            });
        }
    };
}