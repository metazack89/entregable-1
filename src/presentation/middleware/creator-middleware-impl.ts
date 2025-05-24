import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../data/postgres/postgres-database';
import { PetPost } from '../../data/postgres/models/pet-post.model';
import { UserRole } from '../../data/postgres/models/user.model';

export class creatorMiddleware {
    static async requirePostOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const postId = parseInt(req.params.id);

            if (isNaN(postId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid post ID'
                });
            }

            // Admin can access any post
            if (req.user.role === UserRole.ADMIN) {
                return next();
            }

            const petPostRepository = AppDataSource.getRepository(PetPost);
            const post = await petPostRepository.findOne({
                where: { id: postId },
                relations: ['user']
            });

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            // Check if user is the creator of the post
            if (post.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only access your own posts'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error validating post ownership'
            });
        }
    }

    static async requirePostCreator(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const postId = parseInt(req.params.id);

            if (isNaN(postId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid post ID'
                });
            }

            const petPostRepository = AppDataSource.getRepository(PetPost);
            const post = await petPostRepository.findOne({
                where: { id: postId }
            });

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            // Only the creator can perform this action
            if (post.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: Only the post creator can perform this action'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error validating post creator'
            });
        }
    }
}