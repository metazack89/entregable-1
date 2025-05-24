import { z } from 'zod';

export const UpdateUserSchema = z.object({
    contact_email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters')
        .optional(),
    contact_phone: z.string()
        .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Invalid phone number format')
        .optional(),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters')
        .optional(),
    // Puedes añadir más campos opcionales aquí
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export class UpdateUserDtoValidator {
    static validate(data: unknown): UpdateUserDto {
        return UpdateUserSchema.parse(data);
    }
}
