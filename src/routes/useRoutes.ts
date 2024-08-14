import express, { Router } from 'express';
import { userRouter } from './user.routes';
import { securityRouter } from './security.routes';
import { testRouter } from './test.Routes';
import { socialMediasRouter } from './socialMedias.routes';
import { postRouter } from './post.routes';

export const apiRouter: Router = express.Router();

apiRouter.use('/', securityRouter);
apiRouter.use('/test', testRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/socialMedias', socialMediasRouter);
apiRouter.use('/posts', postRouter);