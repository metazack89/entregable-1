import { Repository } from 'typeorm';
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class FinderPetPostService {
    private readonly petPostRepository: Repository<PetPost>;

    constructor() {
        this.petPostRepository = appDataSource.getRepository(PetPost);
    }

    async findAll(): Promise<PetPost[]> {

        return await this.petPostRepository.find({
            relations: ['user'],
        });
    }

    async findById(id: string): Promise<PetPost | null> {

        return await this.petPostRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }
}