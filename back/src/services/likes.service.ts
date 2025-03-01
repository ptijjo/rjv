import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { Like } from '../interfaces/likes.interface';
import { Post } from '@/interfaces/posts.interface';

@Service()
export class LikeService {
  public like = new PrismaClient().like;
  public post = new PrismaClient().post;

  public async createLike(userId: string, postId: string): Promise<Like> {
    const findPost: Post | null = await this.post.findUnique({ where: { id: postId } });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    const existLike: Like | null = await this.like.findUnique({
      where: { uniqueLike: { userId, postId } },
      include: {
        post: true,
      },
    });

    if (existLike) {
      const updateLike: Like = await this.like.update({
        where: { id: existLike.id },
        data: {
          status: !existLike.status,
        },
        include: {
          post: true,
        },
      });

      return updateLike;
    }

    const like: Like = await this.like.create({
      data: {
        userId: userId,
        postId: findPost.id,
        status: true,
      },
      include: {
        post: true,
      },
    });
    return like;
  }

  public async nbLike(postId: string): Promise<number> {
    const findLike: number = await this.like.count({
      where: {
        postId: postId,
        status: true,
      },
    });

    // const likesWithUsers = await this.like.findMany({
    //   where: {
    //     postId: postId,
    //     status: true, // Filtrer uniquement les likes actifs
    //   },
    //   include: {
    //     user: true, // Inclut les infos de l'utilisateur qui a liké
    //   },
    // });
    // const likeCount = likesWithUsers.length; // Nombre total de likes actifs

    return findLike;
  }
}
