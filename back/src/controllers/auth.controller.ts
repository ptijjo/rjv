import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '@services/auth.service';
import { AuthInterface } from '@/interfaces/auth.interface';

export class AuthController {
  public auth = Container.get(AuthService);

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: AuthInterface = req.body;
      const token: string = await this.auth.login(userData);

      // Stocke le token dans un cookie httpOnly
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000, // 1h
        sameSite: 'strict',
      });
      res.status(200).json('connection réussie');
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.clearCookie('token');

      res.status(200).json({ message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
