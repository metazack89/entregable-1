import { Repository } from 'typeorm';
import { User, UserRole } from '../../../data/postgres/models/user.model'; // Importa UserRole
import { CreateUserDto } from '../../../domain/dtos/users/create-user.dto';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class RegisterUserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(createUserDto: CreateUserDto): Promise<User> {

        const userExists = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (userExists) {
            throw new Error(`User with email ${createUserDto.email} already exists`);
        }

        // Convertir el role a UserRole, o usar el valor por defecto
        const userData = {
            ...createUserDto,
            role: createUserDto.role && Object.values(UserRole).includes(createUserDto.role as UserRole)
                ? createUserDto.role as UserRole
                : UserRole.USER,
        };

        const newUser = this.userRepository.create(userData);

        return await this.userRepository.save(newUser);
    }
}