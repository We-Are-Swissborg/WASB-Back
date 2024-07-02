import express, { Router } from 'express';
import { testRouter } from './test.Routes';
import { userRouter } from './user.routes';

export const apiRouter: Router = express.Router();

apiRouter.use('/test', testRouter);
apiRouter.use('/users', userRouter);
