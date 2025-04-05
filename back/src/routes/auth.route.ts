import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';

export class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public auth = new AuthController();
  authController: any;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}login`, this.auth.logIn);
    this.router.post(`${this.path}logout`, this.auth.logOut);
  }
}
