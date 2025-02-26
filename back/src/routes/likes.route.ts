import { Router } from 'express';
import { LikeController } from '../controllers/likes.controller';
import { Routes } from '@interfaces/routes.interface';
import { CookieGuard } from '@/guards/cookie.guard';
import { RoleGuard } from '@/guards/role.guard';

export class LikeRoute implements Routes {
  public path = '/likes';
  public router = Router();
  public like = new LikeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, CookieGuard, RoleGuard(), this.like.createLike);
    this.router.get(`${this.path}`, CookieGuard, RoleGuard(), this.like.nbeLikePerPost);
  }
}
