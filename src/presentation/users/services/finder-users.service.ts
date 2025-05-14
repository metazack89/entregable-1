import { Repository } from 'typeorm';
import { User } from '../../../data/postgres/models/user.model';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class FinderUsersService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(): Promise<User[]> {
        return await this.userRepository.find({
            select: ['id', 'name', 'email', 'role'],
        });
    }
}