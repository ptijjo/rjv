import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { CreateCommentaireDto, UpdateCommentaireDto } from '@dtos/commentaires.dto';
import { HttpException } from '@/exceptions/httpException';
import { Commentaire } from '@interfaces/commentaires.interface';

@Service()
export class CommentaireService {
  public commentaire = new PrismaClient().commentaire;
  public post = new PrismaClient().post;

  public async findAllCommentaire(postId: string): Promise<Commentaire[]> {
    const allCommentaire: Commentaire[] = await this.commentaire.findMany({
      where: { postId: postId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return allCommentaire;
  }

  public async findCommentaireById(commentaireId: string): Promise<Commentaire> {
    const findCommentaire: Commentaire = await this.commentaire.findUnique({ where: { id: commentaireId } });
    if (!findCommentaire) throw new HttpException(409, "Commentaire doesn't exist");

    return findCommentaire;
  }

  public async createCommentaire(commentaireData: CreateCommentaireDto, postId: string, userId: string): Promise<Commentaire> {
    const postComment = await this.post.findUnique({ where: { id: postId } });
    if (!postComment) throw new HttpException(409, 'Post introuvable');

    const create = await this.commentaire.create({ data: { ...commentaireData, postId: postComment.id, userId: userId } });

    return create;
  }

  public async updateCommentaire(commentaireId: string, commentaireData: UpdateCommentaireDto, userId: string): Promise<Commentaire> {
    const comment = await this.commentaire.findUnique({ where: { id: commentaireId } });
    if (!comment) throw new HttpException(409, 'commentaire introuvable');

    if (comment.userId !== userId) throw new HttpException(409, 'Opération interdite');

    const update = await this.commentaire.update({ where: { id: comment.id }, data: { contenu: commentaireData.contenu } });

    return update;
  }

  public async deleteCommentaire(commentaireId: string, user: { id: string; role: string }): Promise<Commentaire> {
    const comment = await this.commentaire.findUnique({ where: { id: commentaireId } });
    if (!comment) throw new HttpException(409, 'commentaire introuvable');

    if (comment.userId !== user.id && user.role === 'user') throw new HttpException(409, 'Opération interdite');

    const deleteCommentaire = await this.commentaire.delete({ where: { id: comment.id } });
    return deleteCommentaire;
  }
}
