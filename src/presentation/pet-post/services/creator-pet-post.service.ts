import { Repository } from 'typeorm';
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { CreatePostDto } from '../../../domain/dtos/post-pet/create-post.dto';
import { appDataSource } from '../../../data/postgres/postgres-database';
import { User } from '../../../data/postgres/models/user.model';

export class CreatorPetPostService {
    private readonly petPostRepository: Repository<PetPost>;
    private readonly userRepository: Repository<User>;

    constructor() {
        this.petPostRepository = appDataSource.getRepository(PetPost);
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(createPostDto: CreatePostDto): Promise<PetPost> {

        const user = await this.userRepository.findOne({
            where: { id: createPostDto.userId }
        });

        if (!user) {
            throw new Error(`User with ID ${createPostDto.userId} not found`);
        }

        const newPost = this.petPostRepository.create({
            ...createPostDto,
            user: user
        });
        return await this.petPostRepository.save(newPost);
    }
}