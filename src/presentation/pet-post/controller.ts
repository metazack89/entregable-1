import { Request, Response } from 'express';
import { CreatorPetPostService } from './services/creator-pet-post.service';
import { FinderPetPostService } from './services/finder-pet-post.service';
import { UpdaterPetPostService } from './services/updater-pet-post.service';
import { EliminatorPetPostService } from './services/eliminator-pet-post.service';
import { CreatePostDto } from '../../domain/dtos/post-pet/create-post.dto';
import { UpdatePostDto } from '../../domain/dtos/post-pet/update.post.dto';
import { PostStatus } from '../../data/postgres/models/pet-post.model';

export class PetPostsController {
    constructor(
        private readonly creatorPetPostService: CreatorPetPostService,
        private readonly finderPetPostService: FinderPetPostService,
        private readonly updaterPetPostService: UpdaterPetPostService,
        private readonly eliminatorPetPostService: EliminatorPetPostService
    ) { }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const posts = await this.finderPetPostService.findAll();
            return res.status(200).json(posts);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public getPostById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const post = await this.finderPetPostService.findById(id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(post);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public createPost = async (req: Request, res: Response) => {
        try {
            const createPostDto = req.body as CreatePostDto;
            const post = await this.creatorPetPostService.execute(createPostDto);
            return res.status(201).json(post);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public updatePost = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatePostDto = req.body as UpdatePostDto;

            const updatedPost = await this.updaterPetPostService.execute(id, updatePostDto);

            if (!updatedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(updatedPost);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public deletePost = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await this.eliminatorPetPostService.execute(id);

            if (!deleted) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public approvePost = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatePostDto: UpdatePostDto = { status: PostStatus.APPROVED };

            const approvedPost = await this.updaterPetPostService.execute(id, updatePostDto);

            if (!approvedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(approvedPost);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    public rejectPost = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updatePostDto: UpdatePostDto = { status: PostStatus.REJECTED };

            const rejectedPost = await this.updaterPetPostService.execute(id, updatePostDto);

            if (!rejectedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(rejectedPost);
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
}