import { AppDataSource } from '../../../data/postgres/postgres-database';
import { User } from '../../../data/postgres/models/user.model';
import { UpdateUserDto } from '../../../domain/dtos/users/update-user.dto';
import { AuthService } from './auth.service';

export class UpdaterUserService {
    private userRepository = AppDataSource.getRepository(User);

    async execute(id: number, updateUserDto: UpdateUserDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id, is_active: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Verifica si el contact_email es nuevo y único
            if (
                updateUserDto.contact_email &&
                updateUserDto.contact_email !== user.contact_email
            ) {
                const existingUser = await this.userRepository.findOne({
                    where: { email: updateUserDto.contact_email }
                });

                if (existingUser) {
                    throw new Error('Contact email already exists');
                }
            }

            // Hashea la contraseña si viene en el DTO
            if (updateUserDto.password) {
                updateUserDto.password = await AuthService.hashPassword(updateUserDto.password);
            }

            const userUpdate: Partial<User> = {
                contact_email: updateUserDto.contact_email,
                password: updateUserDto.password,

            };

            // Elimina campos undefined para evitar errores
            Object.entries(userUpdate).forEach(([key, value]) => {
                if (value === undefined) {
                    delete userUpdate[key as keyof User];
                }
            });

            if (Object.keys(userUpdate).length === 0) {
                throw new Error('No valid fields provided for update');
            }

            await this.userRepository.update(id, userUpdate);

            const updatedUser = await this.userRepository.findOne({
                where: { id }
            });

            if (!updatedUser) {
                throw new Error('Error fetching updated user');
            }

            return AuthService.sanitizeUser(updatedUser);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error updating user');
        }
    }
}
