import express, { Router } from 'express';
import { userRouter } from './userAdmin.routes';
import { parameterRouter } from './parameterAdmin.routes';
import * as Auth from '../../middlewares/auth.middleware';
import Role from '../../types/Role';
import { categoryRouter } from './postCategoryAdmin.routes';
import { postRouter } from './postAdmin.routes';
import { contributionRouter } from './contributionAdmin.routes';
import { membershipRouter } from './membershipAdmin.routes';
import { sessionRouter } from './sessionAdmin.routes';

export const apiAdminRouter: Router = express.Router();

// All routes will pass through the middleware in order to verify the user's role.
apiAdminRouter.use(Auth.authorize([Role.Admin]));

apiAdminRouter.use('/users', userRouter);
apiAdminRouter.use('/parameters', parameterRouter);
apiAdminRouter.use('/postCategories', categoryRouter);
apiAdminRouter.use('/posts', postRouter);
apiAdminRouter.use('/contributions', contributionRouter);
apiAdminRouter.use('/memberships', membershipRouter);
apiAdminRouter.use('/sessions', sessionRouter);
