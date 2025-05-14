import { Repository } from 'typeorm';
import { User } from '../../../data/postgres/models/user.model';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class LoginUserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(email: string, password: string): Promise<User | null> {

        const user = await this.userRepository.findOne({
            where: { email }
        });

        if (!user || user.password !== password) {
            return null;
        }

        return user;
    }
}