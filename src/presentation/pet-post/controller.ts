import { Request, Response } from 'express';
import { CreatorPetPostService } from './services/creator-pet-post.service';
import { FinderPetPostService } from './services/finder-pet-post.service';
import { UpdaterPetPostService } from './services/updater-pet-post.service';
import { EliminatorPetPostService } from './services/eliminator-pet-post.service';
import { CreatePostSchema } from '../../domain/dtos/post-pet/create-post.dto';
import { UpdatePostSchema } from '../../domain/dtos/post-pet/update-post.dto';

export class PetPostController {
    constructor(
        private readonly creatorPetPostService: CreatorPetPostService,
        private readonly finderPetPostService: FinderPetPostService,
        private readonly updaterPetPostService: UpdaterPetPostService,
        private readonly eliminatorPetPostService: EliminatorPetPostService
    ) { }

    create = async (req: Request, res: Response) => {
        try {
            const validation = CreatePostSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: validation.error.errors
                });
            }

            const result = await this.creatorPetPostService.execute(validation.data, req.user!.id);

            if (!result || !result.success) {
                return res.status(400).json({ message: result ? result.message : 'Unknown error' });
            }

            return res.status(201).json({
                message: result.message,
                petPost: result.petPost
            });
        } catch (error) {
            console.error('Error creating pet post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    findAll = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await this.finderPetPostService.findAll(page, limit, req.user!.role);

            // If result is an array, wrap it in an object with pagination info
            const petPosts = Array.isArray(result) ? result : (result as any).petPosts;
            const totalItems = Array.isArray(result)
                ? result.length
                : ((result as any).total ?? petPosts.length);
            const totalPages = Math.ceil(totalItems / limit);

            return res.status(200).json({
                message: 'Pet posts retrieved successfully',
                petPosts: petPosts,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: totalItems,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Error finding pet posts:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    findById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Valid ID is required' });
            }

            const result = await this.finderPetPostService.findById(id, req.user!.role, req.user!.id);

            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            return res.status(200).json({
                message: result.message,
                petPost: result.petPost
            });
        } catch (error) {
            console.error('Error finding pet post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Valid ID is required' });
            }

            const validation = UpdatePostSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    message: 'Validation error',
                    errors: validation.error.errors
                });
            }

            const result = await this.updaterPetPostService.execute(
                id,
                validation.data,
                req.user!.role,
                validation.data
            );

            if (!result.success) {
                return res.status(400).json({ message: result.message });
            }

            return res.status(200).json({
                message: result.message,
                petPost: result.petPost
            });
        } catch (error) {
            console.error('Error updating pet post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Valid ID is required' });
            }

            const result = await this.eliminatorPetPostService.execute(id, req.user!.role, req.user!.id);

            if (!result.deletedPostId) {
                return res.status(400).json({ message: result.message });
            }

            return res.status(200).json({ message: result.message, deletedPostId: result.deletedPostId });
        } catch (error) {
            console.error('Error deleting pet post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    // Admin endpoints
    approve = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Valid ID is required' });
            }

            await this.updaterPetPostService.changeStatus(id, 'approved', req.user!.role);

            return res.status(200).json({
                message: 'Pet post approved successfully'
            });
        } catch (error) {
            console.error('Error approving pet post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    reject = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Valid ID is required' });
            }

            await this.updaterPetPostService.changeStatus(id, 'rejected', req.user!.role);

            return res.status(200).json({
                message: 'Pet post rejected successfully'
            });
        } catch (error) {
            console.error('Error rejecting pet post:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}