import { Router } from 'express';
import { PostController } from '../controllers/posts.controller';
import { CreatePostDto, UpdatePostDto } from '../dtos/posts.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CookieGuard } from '@/guards/cookie.guard';
import { RoleGuard } from '@/guards/role.guard';

export class PostRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public post = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, CookieGuard, RoleGuard(), this.post.getPosts);
    this.router.get(`${this.path}/:id`, CookieGuard, RoleGuard(), this.post.getPostById);
    this.router.post(`${this.path}`, CookieGuard, ValidationMiddleware(CreatePostDto), this.post.createPost);
    this.router.patch(`${this.path}/:id`, CookieGuard, ValidationMiddleware(UpdatePostDto, true), this.post.updatePost);
    this.router.delete(`${this.path}/:id`, CookieGuard, RoleGuard(), this.post.deleteUser);
  }
}
