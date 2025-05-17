import { Repository } from 'typeorm';
import { User } from '../../../data/postgres/models/user.model';
import { UpdateUserDto } from '../../../domain/dtos/users/update.post.dto';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class UpdaterUserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {

        const user = await this.userRepository.findOne({
            where: { id }
        });

        if (!user) {
            return null;
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const userWithEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email }
            });

            if (userWithEmail) {
                throw new Error(`User with email ${updateUserDto.email} already exists`);
            }
        }

        const updateData: any = { ...updateUserDto };
        if (updateUserDto.role !== undefined) {

            updateData.role = (updateUserDto.role as any);
        }
        this.userRepository.merge(user, updateData);


        return await this.userRepository.save(user);
    }
}