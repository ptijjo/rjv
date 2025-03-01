import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { PostRoute } from './routes/posts.route';
import { LikeRoute } from './routes/likes.route';
import { CommentaireRoute } from './routes/commentaires.route';

ValidateEnv();

const app = new App([new UserRoute(), new AuthRoute(), new PostRoute(), new LikeRoute(), new CommentaireRoute()]);

app.listen();

export const socketInstance = app.getSocketInstance();
