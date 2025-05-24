import { AppDataSource } from '../../../data/postgres/postgres-database';
import { PetPost, PostStatus } from '../../../data/postgres/models/pet-post.model';
import { UserRole } from '../../../data/postgres/models/user.model';

export class FinderPetPostService {
    private petPostRepository = AppDataSource.getRepository(PetPost);

    async findAll(page: number, limit: number, userRole?: UserRole, userId?: number) {
        try {
            const whereCondition: any = { is_active: true };

            if (userRole !== UserRole.ADMIN) {
                whereCondition.status = PostStatus.APPROVED;
            }

            const posts = await this.petPostRepository.find({
                where: whereCondition,
                relations: ['user'],
                order: { created_at: 'DESC' },
                skip: (page - 1) * limit,
                take: limit
            });

            return posts;
        } catch (error) {
            throw new Error('Error fetching pet posts');
        }
    }

    async findById(id: number, userRole?: UserRole, userId?: number) {
        try {
            const post = await this.petPostRepository.findOne({
                where: { id, is_active: true },
                relations: ['user']
            });

            if (!post) {
                throw new Error('Pet post not found');
            }

            const isAdmin = userRole === UserRole.ADMIN;
            const isOwner = Number(post.user_id) === Number(userId);

            if (!isAdmin && post.status !== PostStatus.APPROVED && !isOwner) {
                throw new Error('Access denied to this post');
            }

            return post;
        } catch (error) {
            throw error instanceof Error ? error : new Error('Error fetching pet post');
        }
    }

    async findByUserId(targetUserId: number, requestingUserRole?: UserRole, requestingUserId?: number) {
        try {
            const whereCondition: any = {
                user_id: targetUserId,
                is_active: true
            };

            const isAdmin = requestingUserRole === UserRole.ADMIN;
            const isOwner = requestingUserId === targetUserId;

            if (!isAdmin && !isOwner) {
                whereCondition.status = PostStatus.APPROVED;
            }

            const posts = await this.petPostRepository.find({
                where: whereCondition,
                relations: ['user'],
                order: { created_at: 'DESC' }
            });

            return posts;
        } catch (error) {
            throw new Error('Error fetching user pet posts');
        }
    }

    async findPendingPosts() {
        try {
            const posts = await this.petPostRepository.find({
                where: {
                    status: PostStatus.PENDING,
                    is_active: true
                },
                relations: ['user'],
                order: { created_at: 'ASC' }
            });

            return posts;
        } catch (error) {
            throw new Error('Error fetching pending posts');
        }
    }

    async searchPosts(searchTerm: string, userRole?: UserRole) {
        try {
            const queryBuilder = this.petPostRepository
                .createQueryBuilder('post')
                .leftJoinAndSelect('post.user', 'user')
                .where('post.is_active = :isActive', { isActive: true })
                .andWhere(
                    `(LOWER(post.title) LIKE LOWER(:searchTerm)
                    OR LOWER(post.description) LIKE LOWER(:searchTerm)
                    OR LOWER(post.pet_name) LIKE LOWER(:searchTerm)
                    OR LOWER(post.pet_type) LIKE LOWER(:searchTerm)
                    OR LOWER(post.location) LIKE LOWER(:searchTerm))`,
                    { searchTerm: `%${searchTerm}%` }
                );

            if (userRole !== UserRole.ADMIN) {
                queryBuilder.andWhere('post.status = :status', { status: PostStatus.APPROVED });
            }

            const posts = await queryBuilder
                .orderBy('post.created_at', 'DESC')
                .getMany();

            return posts;
        } catch (error) {
            throw new Error('Error searching pet posts');
        }
    }
}
