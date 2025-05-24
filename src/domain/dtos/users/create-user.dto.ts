import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),
    email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(255, 'Password must be less than 255 characters'),
    role: z.enum(['admin', 'user']).optional().default('user')
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export class CreateUserDtoValidator {
    static validate(data: unknown): CreateUserDto {
        return CreateUserSchema.parse(data);
    }

    static validatePartial(data: unknown): Partial<CreateUserDto> {
        return CreateUserSchema.partial().parse(data);
    }
}