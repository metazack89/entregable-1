import { AppDataSource } from '../../../data/postgres/postgres-database';
import { PetPost, PostStatus } from '../../../data/postgres/models/pet-post.model';
import { CreatePostDto } from '../../../domain/dtos/post-pet/create-post.dto';

export class CreatorPetPostService {
    private petPostRepository = AppDataSource.getRepository(PetPost);
    petPost: any;

    async execute(createPostDto: CreatePostDto, userId: number) {
        try {
            // Create new pet post
            const newPost = this.petPost.create({
                ...createPostDto,
                user: { id: userId },
                status: PostStatus.PENDING // All posts start as pending
            });

            const savedPost = await this.petPostRepository.save(newPost);

            // Fetch the complete post with user relation
            const completePost = await this.petPostRepository.findOne({
                where: { id: (savedPost as unknown as PetPost).id },
                relations: ['user']
            });

            return completePost;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error creating pet post');
        }
    }
}