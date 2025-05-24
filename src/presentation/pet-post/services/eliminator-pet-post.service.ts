import { AppDataSource } from '../../../data/postgres/postgres-database';
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { UserRole } from '../../../data/postgres/models/user.model';

export class EliminatorPetPostService {
    private petPostRepository = AppDataSource.getRepository(PetPost);

    async execute(id: number, userRole: UserRole, userId: number) {
        try {
            const post = await this.petPostRepository.findOne({
                where: { id, is_active: true }
            });

            if (!post) {
                throw new Error('Pet post not found');
            }

            // Check permissions
            if (userRole !== UserRole.ADMIN && post.user_id !== userId) {
                throw new Error('Access denied: You can only delete your own posts');
            }

            // Soft delete - set is_active to false
            await this.petPostRepository.update(id, { is_active: false });

            return {
                message: 'Pet post deleted successfully',
                deletedPostId: id
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error deleting pet post');
        }
    }

    async hardDelete(id: number, userRole: UserRole, userId: number) {
        try {
            const post = await this.petPostRepository.findOne({
                where: { id }
            });

            if (!post) {
                throw new Error('Pet post not found');
            }

            // Check permissions - only admin can hard delete
            if (userRole !== UserRole.ADMIN) {
                throw new Error('Access denied: Only administrators can permanently delete posts');
            }

            // Hard delete - permanently remove from database
            await this.petPostRepository.remove(post);

            return {
                message: 'Pet post permanently deleted',
                deletedPostId: id
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error deleting pet post');
        }
    }
}