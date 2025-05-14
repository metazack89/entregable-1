import { Repository } from 'typeorm';
import { User } from '../../../data/postgres/models/user.model';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class EliminatorUserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(id: string): Promise<boolean> {

        const user = await this.userRepository.findOne({
            where: { id }
        });

        if (!user) {
            return false;
        }

        const result = await this.userRepository.delete(id);

        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }
}