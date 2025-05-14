import { PostStatus } from '../../../data/postgres/models/pet-post.model';

export class UpdatePostDto {
    title?: string;
    description?: string;
    imageUrl?: string;
    status?: PostStatus;
}