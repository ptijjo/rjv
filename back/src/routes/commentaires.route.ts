import { Router } from 'express';
import { CommentaireController } from '../controllers/commentaires.controller';
import { CreateCommentaireDto, UpdateCommentaireDto } from '../dtos/commentaires.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CookieGuard } from '@/guards/cookie.guard';
import { RoleGuard } from '@/guards/role.guard';

export class CommentaireRoute implements Routes {
  public path = '/commentaires';
  public router = Router();
  public commentaire = new CommentaireController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, CookieGuard, RoleGuard(), this.commentaire.getCommentaires);
    this.router.get(`${this.path}/:id`, CookieGuard, RoleGuard(), this.commentaire.getCommentaireById);
    this.router.post(`${this.path}`, CookieGuard, ValidationMiddleware(CreateCommentaireDto), this.commentaire.createCommentaire);
    this.router.patch(`${this.path}`, CookieGuard, ValidationMiddleware(UpdateCommentaireDto, true), this.commentaire.updateCommentaire);
    this.router.delete(`${this.path}/:id`, CookieGuard, RoleGuard(), this.commentaire.deleteCommentaire);
  }
}
