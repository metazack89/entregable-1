import { Repository } from 'typeorm';
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { UpdatePostDto } from '../../../domain/dtos/post-pet/update.post.dto';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class UpdaterPetPostService {
    private readonly petPostRepository: Repository<PetPost>;

    constructor() {
        this.petPostRepository = appDataSource.getRepository(PetPost);
    }

    async execute(id: string, updatePostDto: UpdatePostDto): Promise<PetPost | null> {

        const post = await this.petPostRepository.findOne({
            where: { id },
            relations: ['user'],
        });

        if (!post) {
            return null;
        }

        this.petPostRepository.merge(post, updatePostDto);

        post.updatedAt = new Date();

        return await this.petPostRepository.save(post);
    }
}