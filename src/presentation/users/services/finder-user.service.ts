import { AppDataSource } from '../../../data/postgres/postgres-database';
import { User } from '../../../data/postgres/models/user.model';
import { AuthService } from './auth.service';

export class FinderUserService {
    private userRepository = AppDataSource.getRepository(User);

    async findAll() {
        try {
            const users = await this.userRepository.find({
                where: { is_active: true },
                order: { created_at: 'DESC' }
            });

            return users.map(user => AuthService.sanitizeUser(user));
        } catch (error) {
            throw new Error('Error fetching users');
        }
    }

    async findById(id: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id, is_active: true },
                relations: ['pet_posts']
            });

            if (!user) {
                throw new Error('User not found');
            }

            return AuthService.sanitizeUser(user);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error fetching user');
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.userRepository.findOne({
                where: { email, is_active: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            return AuthService.sanitizeUser(user);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error fetching user');
        }
    }
}