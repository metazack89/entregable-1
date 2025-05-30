import { z } from 'zod';

export const CreatePostSchema = z.object({
    title: z.string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title must be less than 200 characters'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters'),
    pet_type: z.string()
        .min(2, 'Pet type must be at least 2 characters')
        .max(50, 'Pet type must be less than 50 characters'),
    pet_name: z.string()
        .min(1, 'Pet name is required')
        .max(100, 'Pet name must be less than 100 characters'),
    location: z.string()
        .min(5, 'Location must be at least 5 characters')
        .max(200, 'Location must be less than 200 characters'),
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
        .optional()
});

export type CreatePostDto = z.infer<typeof CreatePostSchema>;

export class CreatePostDtoValidator {
    static validate(data: unknown): CreatePostDto {
        return CreatePostSchema.parse(data);
    }
}