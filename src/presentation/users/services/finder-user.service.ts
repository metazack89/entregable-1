import { Repository } from 'typeorm';
import { User } from '../../../data/postgres/models/user.model';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class FinderUserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(id: string): Promise<User | null> {

        return await this.userRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'role'],
        });
    }
}