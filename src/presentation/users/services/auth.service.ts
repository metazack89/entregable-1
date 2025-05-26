import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { envs } from '../../../config';
import { User, UserRole } from '../../../data/postgres/models/user.model';

interface TokenPayload {
    id: number;
    email: string;
    role: UserRole;
}

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(envs.BCRYPT_ROUNDS);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error('Error hashing password');
        }
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Error comparing passwords');
        }
    }

    static generateToken(user: User): string {
        try {
            const payload: TokenPayload = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            const options: jwt.SignOptions = {
                expiresIn: envs.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
            };

            return jwt.sign(payload, envs.JWT_KEY as jwt.Secret, options);
        } catch (error) {
            throw new Error('Error generating token');
        }
    }

    static verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, envs.JWT_KEY as jwt.Secret) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    static sanitizeUser(user: User): Omit<User, 'password'> {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
