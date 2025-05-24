import { AppDataSource } from '../../../data/postgres/postgres-database';
import { User } from '../../../data/postgres/models/user.model';
import { CreateUserDto } from '../../../domain/dtos/users/create-user.dto';
import { AuthService } from './auth.service';

export class RegisterUserService {
    private userRepository = AppDataSource.getRepository(User);

    async execute(createUserDto: CreateUserDto) {
        try {
            // Check if user already exists
            const existingUser = await this.userRepository.findOne({
                where: { email: createUserDto.email }
            });

            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            // Hash password
            const hashedPassword = await AuthService.hashPassword(createUserDto.password);

            // Create new user
            const newUser = this.userRepository.create({
                ...createUserDto,
                password: hashedPassword,
                role: createUserDto.role as any
            });

            const savedUser = await this.userRepository.save(newUser);

            // Generate token
            const token = AuthService.generateToken(savedUser);

            // Return user without password and token
            return {
                user: AuthService.sanitizeUser(savedUser),
                token
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error registering user');
        }
    }
}