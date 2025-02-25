import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CookieGuard } from '@/guards/cookie.guard';
import { RoleGuard } from '@/guards/role.guard';
import uploadAvatar from '@/middlewares/avatar.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, CookieGuard, RoleGuard(), this.user.getUsers);
    this.router.get(`${this.path}/:id`, CookieGuard, RoleGuard(), this.user.getUserById);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.patch(`${this.path}/:id`, CookieGuard, ValidationMiddleware(UpdateUserDto, true), uploadAvatar, this.user.updateUser);
    this.router.delete(`${this.path}/:id`, CookieGuard, RoleGuard(['admin']), this.user.deleteUser);
  }
}
