import { z } from 'zod';
import { AppDataSource } from '../../../data/postgres/postgres-database';
import { User } from '../../../data/postgres/models/user.model';
import { AuthService } from './auth.service';

const LoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

export type LoginDto = z.infer<typeof LoginSchema>;

export class LoginUserService {
    private userRepository = AppDataSource.getRepository(User);

    async execute(loginDto: LoginDto) {
        try {
            // Validate input
            const validatedData = LoginSchema.parse(loginDto);

            // Find user by email
            const user = await this.userRepository.findOne({
                where: { email: validatedData.email, is_active: true }
            });

            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Compare password
            const isPasswordValid = await AuthService.comparePassword(
                validatedData.password,
                user.password
            );

            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Generate token
            const token = AuthService.generateToken(user);

            // Return user without password and token
            return {
                user: AuthService.sanitizeUser(user),
                token
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new Error(error.errors[0].message);
            }
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error during login');
        }
    }
}