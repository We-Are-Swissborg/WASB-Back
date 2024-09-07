import express, { Router } from 'express';
import { userRouter } from './user.routes';
import { securityRouter } from './security.routes';
import { testRouter } from './test.Routes';
import { postRouter } from './post.routes';
import { apiADminRouter } from './admin/adminRoutes';

export const apiRouter: Router = express.Router();
apiRouter.use('/admin/', apiADminRouter);

apiRouter.use('/', securityRouter);
apiRouter.use('/test', testRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);
