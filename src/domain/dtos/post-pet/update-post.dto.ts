import { z } from 'zod';

export const UpdatePostSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be less than 200 characters')
        .optional(),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters')
        .optional(),
    pet_type: z.string()
        .min(2, 'Pet type must be at least 2 characters')
        .max(50, 'Pet type must be less than 50 characters')
        .optional(),
    pet_name: z.string()
        .min(1, 'Pet name is required')
        .max(100, 'Pet name must be less than 100 characters')
        .optional(),
    location: z.string()
        .min(5, 'Location must be at least 5 characters')
        .max(200, 'Location must be less than 200 characters')
        .optional(),
    contact_phone: z.string()
        .regex(/^\+?[\d\s\-\(\)]{10,15}$/, 'Invalid phone number format')
        .optional(),
    contact_email: z.string()
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters')
        .optional(),
    image_url: z.string()
        .url('Invalid image URL')
        .max(500, 'Image URL must be less than 500 characters')
        .optional(),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    is_active: z.boolean().optional()
});

export type UpdatePetPostDto = z.infer<typeof UpdatePostSchema>;

export class UpdatePetPostDtoValidator {
    static validate(data: unknown): UpdatePetPostDto {
        return UpdatePostSchema.parse(data);
    }
}