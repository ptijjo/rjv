import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import fs from 'fs/promises';
import path from 'path';

@Service()
export class UserService {
  public user = new PrismaClient().user;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findMany();
    return allUser;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User | null = await this.user.findUnique({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const existGoogleId: User | null = await this.user.findUnique({
      where: { googleId: userData.googleId },
    });

    if (existGoogleId) throw new HttpException(409, `This email ${userData.email} already exists`);

    if (userData.password && !userData.googleId) {
      const hashedPassword = await hash(userData.password, 10);
      const createUserData: User = await this.user.create({ data: { ...userData, password: hashedPassword } });
      return createUserData;
    }
    throw new HttpException(409, "Veuillez choisir un type d'inscription");
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    const findUser: User | null = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updatedUserData: any = { ...userData };

    // Gestion du rôle
    if (userData.role) {
      updatedUserData.role = userData.role as Role;
      if (updatedUserData.role !== 'admin') {
        throw new HttpException(409, 'Authorisation admin requise');
      }
    }

    // Hachage du mot de passe s'il est mis à jour
    if (userData.password) {
      updatedUserData.password = await hash(userData.password, 10);
    }

    if (userData.avatar && userData.avatar) {
      try {
        // Extraction du chemin après le port (ex: "/public/avatar/...")
        const relativePath = new URL(findUser.avatar).pathname;

        // Création du chemin absolu (assume que les fichiers sont stockés dans "/public" à la racine du projet)
        const filePath = path.join(__dirname, '..', '..', relativePath);

        await fs.access(filePath);

        await fs.unlink(filePath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          throw new HttpException(409, `Fichier déjà supprimé ou introuvable : ${err.path}`);
        } else {
          throw new HttpException(409, `Erreur lors de la suppression de l'ancien avatar : ${err}`);
        }
      }
    }

    const updateUserData: User = await this.user.update({ where: { id: findUser.id }, data: { ...updatedUserData } });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    if (findUser.role !== 'admin') {
      throw new HttpException(409, 'Authorisation admin requise');
    }

    const deleteUserData = await this.user.delete({ where: { id: findUser.id } });
    return deleteUserData;
  }
}
