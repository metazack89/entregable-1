import { AppDataSource } from '../../../data/postgres/postgres-database';
import { PetPost } from '../../../data/postgres/models/pet-post.model';
import { UpdatePetPostDto } from '../../../domain/dtos/post-pet/update-post.dto';
import { UserRole } from '../../../data';

export class UpdaterPetPostService {
    changeStatus(id: number, arg1: string, role: UserRole) {
        throw new Error('Method not implemented.');
    }
    async execute(
        id: number,
        dto: UpdatePetPostDto,
        role: UserRole,
        data: { status?: "pending" | "approved" | "rejected" | undefined; is_active?: boolean | undefined; contact_email?: string | undefined; contact_phone?: string | undefined; title?: string | undefined; description?: string | undefined; pet_type?: string | undefined; pet_name?: string | undefined; location?: string | undefined; image_url?: string | undefined; }
    ): Promise<PetPost> {
        const postRepository = AppDataSource.getRepository(PetPost);

        // Verificar si el post existe
        const postId = Number(id);
        const post = await postRepository.findOneBy({ id: postId });
        if (!post) {
            throw new Error(`Post with id ${id} not found`);
        }

        // Adapt dto.status if necessary to match the expected type
        const updateData = { ...dto };
        if (dto.status !== undefined) {
            // Assign status directly as a string value
            updateData.status = dto.status;
        }
        await postRepository.update(postId, updateData as any);

        // Obtener post actualizado
        return await postRepository.findOne({
            where: { id: postId },
            relations: ['user'],
        }) as PetPost;
    }
}