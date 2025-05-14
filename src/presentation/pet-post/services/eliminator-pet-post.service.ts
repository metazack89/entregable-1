import { Repository } from 'typeorm';
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class EliminatorPetPostService {
    private readonly petPostRepository: Repository<PetPost>;

    constructor() {
        this.petPostRepository = appDataSource.getRepository(PetPost);
    }

    async execute(id: string): Promise<boolean> {

        const post = await this.petPostRepository.findOne({
            where: { id }
        });

        if (!post) {
            return false;
        }

        const result = await this.petPostRepository.delete(id);

        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }
}