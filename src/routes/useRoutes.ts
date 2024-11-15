import express, { Router } from 'express';
import { userRouter } from './user.routes';
import { securityRouter } from './security.routes';
import { testRouter } from './test.Routes';
import { postRouter } from './post.routes';
import { parameterRouter } from './parameter.routes';
import { apiAdminRouter } from './admin/adminRoutes';
import { contributionRouter } from './contribution.routes';
import { membershipRouter } from './membership.routes';

export const apiRouter: Router = express.Router();
apiRouter.use('/admin/', apiAdminRouter);

apiRouter.use('/', securityRouter);
apiRouter.use('/test', testRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/parameters', parameterRouter);
apiRouter.use('/contributions', contributionRouter);
apiRouter.use('/memberships', membershipRouter);
