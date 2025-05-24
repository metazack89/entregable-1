import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envs } from '../../config';
import { AppDataSource } from '../../data/postgres/postgres-database';
import { User, UserRole } from '../../data/postgres/models/user.model';

interface JwtPayload {
    id: number;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export class authMiddleware {
    static async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is required'
                });
            }

            const token = authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token is required'
                });
            }

            const decoded = jwt.verify(token, envs.JWT_SECRET) as JwtPayload;

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { id: decoded.id, is_active: true }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token or user not found'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Authentication error'
            });
        }
    }

    static requireAdmin(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();
    }

    static requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const resourceUserId = parseInt(req.params.id);

        if (req.user.role === UserRole.ADMIN || req.user.id === resourceUserId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied: You can only access your own resources'
        });
    }
}