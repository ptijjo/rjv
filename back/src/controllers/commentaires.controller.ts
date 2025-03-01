import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Commentaire } from '@interfaces/commentaires.interface';
import { CommentaireService } from '../services/commentaires.service';
import { CreateCommentaireDto, UpdateCommentaireDto } from '@/dtos/commentaires.dto';
import { NotificationType } from '@prisma/client';
import { HttpException } from '@/exceptions/httpException';
import { Notification } from '@/interfaces/notification.interface';
import { NotificationService } from '@/services/notification.service';

export class CommentaireController {
  public commentaire = Container.get(CommentaireService);
  public notification = Container.get(NotificationService);

  public getCommentaires = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = req.body.postId;
      const findAllCommentairesData: Commentaire[] = await this.commentaire.findAllCommentaire(postId);

      res.status(200).json({ data: findAllCommentairesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCommentaireById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentaireId = String(req.params.id);
      const findOneCommentaireData: Commentaire = await this.commentaire.findCommentaireById(commentaireId);

      res.status(200).json({ data: findOneCommentaireData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCommentaire = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentaireData: CreateCommentaireDto = req.body;
      const postId = req.body.postId;
      const userId = req.user.id as string;

      const createCommentaireData: Commentaire = await this.commentaire.createCommentaire(commentaireData, postId, userId);

      const receiverId = createCommentaireData?.post?.authorId; // Il est important de vérifier que post existe

      if (!receiverId) {
        throw new HttpException(409, 'AuthorId not found');
      }

      const notificationData = {
        type: NotificationType.commentaire,
        notifiableId: createCommentaireData.id as string,
      };

      const notification: Notification = await this.notification.createNotification(userId, receiverId, notificationData);

      res.status(201).json({ data: { createCommentaireData, notification }, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCommentaire = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentaireId = req.body.commentaireId as string;
      const commentaireData: UpdateCommentaireDto = req.body;
      const userId = req.user.id as string;

      const commentaire = await this.commentaire.updateCommentaire(commentaireId, commentaireData, userId);

      res.status(200).json({ data: commentaire, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCommentaire = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const commentaireId = String(req.params.id);
      const user = { id: req.user.id, role: req.user.role };
      const deleteCommentaireData: Commentaire = await this.commentaire.deleteCommentaire(commentaireId, user);

      res.status(200).json({ data: deleteCommentaireData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
