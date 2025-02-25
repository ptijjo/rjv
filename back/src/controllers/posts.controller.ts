import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Post } from '@interfaces/posts.interface';
import { PostService } from '../services/posts.service';
import { CreatePostDto } from '@/dtos/posts.dto';

export class PostController {
  public post = Container.get(PostService);

  public getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllPostsData: Post[] = await this.post.findAllPost();

      res.status(200).json({ data: findAllPostsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = String(req.params.id);
      const findOnePostData: Post = await this.post.findPostById(postId);

      res.status(200).json({ data: findOnePostData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postData: CreatePostDto = req.body;
      const authorId = req.user.id as string;
      const createPostData: Post = await this.post.createPost(postData, authorId);

      res.status(201).json({ data: createPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = String(req.params.id);
      const postData: Post = req.body;

      if (postData.authorId !== req.user.id) res.status(404).json({ message: 'Opération interdite' });

      if (req.file) postData.media = `${req.protocol}://${req.get('host')}/public/media/${req.file.filename}`.split(' ').join('');

      const updatePostData: Post = await this.post.updatePost(postId, postData);

      res.status(200).json({ data: updatePostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = String(req.params.id);
      const deletePostData: Post = await this.post.deletePost(postId);

      res.status(200).json({ data: deletePostData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
