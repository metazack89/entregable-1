import { Repository } from 'typeorm';
import { User } from '../../../data/postgres/models/user.model';
import { CreateUserDto } from '../../../domain/dtos/users/create-user.dto';
import { appDataSource } from '../../../data/postgres/postgres-database';

export class RegisterUserService {
    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = appDataSource.getRepository(User);
    }

    async execute(createUserDto: CreateUserDto): Promise<User> {
        // Verificar si el email ya existe
        const userExists = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (userExists) {
            throw new Error(`User with email ${createUserDto.email} already exists`);
        }

        // Crear nuevo usuario
        const newUser = this.userRepository.create(createUserDto);

        // Guardar en la base de datos
        return await this.userRepository.save(newUser);
    }
}