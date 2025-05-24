import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User, UserRole } from './user.model';

export enum PostStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('pet_posts')
export class PetPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 50 })
    pet_type: string;

    @Column({ type: 'varchar', length: 100 })
    pet_name: string;

    @Column({ type: 'varchar', length: 200 })
    location: string;

    @Column({ type: 'varchar', length: 15, nullable: true })
    contact_phone: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    contact_email: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    image_url: string;


    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    status: UserRole;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ name: 'user_id' })
    user_id: number;

    @ManyToOne(() => User, user => user.pet_posts)
    @JoinColumn({ name: 'user_id' })
    user: User;
    message: any;
    petPost: any;
    success: any;
}