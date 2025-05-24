import { AppDataSource } from '../../../data/postgres/postgres-database';
import { User } from '../../../data/postgres/models/user.model';

export class EliminatorUserService {
    private userRepository = AppDataSource.getRepository(User);

    async execute(id: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id, is_active: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Soft delete - set is_active to false
            await this.userRepository.update(id, { is_active: false });

            return {
                message: 'User deleted successfully',
                deletedUserId: id
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error deleting user');
        }
    }

    async hardDelete(id: number) {
        try {
            const user = await this.userRepository.findOne({
                where: { id }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Hard delete - permanently remove from database
            await this.userRepository.remove(user);

            return {
                message: 'User permanently deleted',
                deletedUserId: id
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error permanently deleting user');
        }
    }
}