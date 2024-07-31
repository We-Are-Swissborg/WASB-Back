import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as User from '../controllers/user.controller';

export const userRouter: Router = express.Router();

userRouter.get('/codeRef/:codeRef', User.checkReferralExist);
userRouter.get('/', Auth.authorize(), User.getAllUsers);
userRouter.get('/:id', Auth.authorize(), User.getUser);
userRouter.get('/allInfo/:id', Auth.authorize(), User.getUserWithAllInfo);

userRouter.put('/:id', Auth.authorize(), User.updateAllInfo);