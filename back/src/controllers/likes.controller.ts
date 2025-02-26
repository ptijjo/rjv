import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Like } from '@interfaces/likes.interface';
import { LikeService } from '../services/likes.service';

export class LikeController {
  public like = Container.get(LikeService);

  public createLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.body.postId;
      const userId: string = req.user.id as string;

      const like: Like = await this.like.createLike(userId, postId);

      res.status(200).json({ data: like, message: 'post liked' });
    } catch (error) {
      next(error);
    }
  };

  public nbeLikePerPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.body.postId;

      const nbLike = await this.like.nbLike(postId);
      res.status(200).json({ data: nbLike, message: 'number of likes' });
    } catch (error) {
      next(error);
    }
  };
}
