import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Like } from '@interfaces/likes.interface';
import { LikeService } from '../services/likes.service';
import { Notification } from '@/interfaces/notification.interface';
import { NotificationService } from '../services/notification.service';
import { NotificationType } from '@prisma/client';
import { HttpException } from '@/exceptions/httpException';

export class LikeController {
  public like = Container.get(LikeService);
  public notification = Container.get(NotificationService);

  public createLike = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.body.postId;
      const userId: string = req.user.id as string;

      const like: Like = await this.like.createLike(userId, postId);

      const receiverId = like?.post?.authorId; // Il est important de vérifier que post existe

      if (!receiverId) {
        throw new HttpException(409, 'AuthorId not found');
      }

      const notificationData = {
        type: NotificationType.like,
        notifiableId: postId as string,
      };

      if (like.status === true) {
        const notification: Notification = await this.notification.createNotification(userId, receiverId, notificationData);

        res.status(200).json({ data: { like, notification }, message: 'post liked' });
      } else {
        res.status(200).json({ data: like, message: 'post liked' });
      }
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
