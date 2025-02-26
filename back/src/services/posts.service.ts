import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { CreatePostDto, UpdatePostDto } from '../dtos/posts.dto';
import { HttpException } from '@/exceptions/httpException';
import { Post } from '@interfaces/posts.interface';

@Service()
export class PostService {
  public post = new PrismaClient().post;

  public async findAllPost(): Promise<Post[]> {
    const allPost: Post[] = await this.post.findMany({ include: { author: true } });
    return allPost;
  }

  public async findPostById(userId: string): Promise<Post> {
    const findPost: Post = await this.post.findUnique({ where: { id: userId }, include: { author: true } });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    return findPost;
  }

  public async createPost(postData: CreatePostDto, authorId: string): Promise<Post> {
    const createPostData: Post = await this.post.create({ data: { ...postData, authorId: authorId }, include: { author: true } });
    return createPostData;
  }

  public async updatePost(userId: string, userData: UpdatePostDto): Promise<Post> {
    const findPost: Post | null = await this.post.findUnique({ where: { id: userId } });
    if (!findPost) throw new HttpException(409, "Post doesn't exist");

    const updatedUserData = { ...userData };

    const updatePostData: Post = await this.post.update({ where: { id: findPost.id }, data: { ...updatedUserData } });
    return updatePostData;
  }

  public async deletePost(postId: string): Promise<Post> {
    const findPost: Post = await this.post.findUnique({ where: { id: postId } });
    if (!findPost) throw new HttpException(409, "User doesn't exist");

    const deletePostData = await this.post.delete({ where: { id: findPost.id } });
    return deletePostData;
  }
}
