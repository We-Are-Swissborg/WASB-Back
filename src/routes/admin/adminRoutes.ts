import express, { Router } from 'express';
import { userRouter } from './userAdmin.routes';
import * as Auth from '../../middlewares/auth.middleware';
import Role from '../../types/Role';

export const apiADminRouter: Router = express.Router();

// All routes will pass through the middleware in order to verify the user's role.
apiADminRouter.use(Auth.authorize([Role.Admin]));

apiADminRouter.use('/users', userRouter);
