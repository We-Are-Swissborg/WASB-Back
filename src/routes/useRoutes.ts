import express, { Router } from 'express';
import { userRouter } from './user.routes';
import { securityRouter } from './security.routes';
import { testRouter } from './test.Routes';
import { postRouter } from './post.routes';
import { parameterRouter } from './parameter.routes';
import { apiAdminRouter } from './admin/admin.routes';
import { contributionRouter } from './contribution.routes';
import { membershipRouter } from './membership.routes';
import { metricsRouter } from './metrics.routes';
import { sessionRouter } from './session.routes';

export const apiRouter: Router = express.Router();
console.log('Loading route: /admin');
apiRouter.use('/admin', apiAdminRouter);

apiRouter.use('/', securityRouter);
apiRouter.use('/test', testRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/parameters', parameterRouter);
apiRouter.use('/contributions', contributionRouter);
apiRouter.use('/memberships', membershipRouter);
apiRouter.use('/metrics', metricsRouter);
apiRouter.use('/sessions', sessionRouter);

