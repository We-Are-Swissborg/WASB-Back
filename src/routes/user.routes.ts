import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as User from '../controllers/user.controller';
import Role from '../types/Role';

export const userRouter: Router = express.Router();

userRouter.get('/codeRef/:codeRef', User.checkReferralExist);
userRouter.get('/', Auth.authorize([Role.Admin]), User.getAllUsers);
userRouter.get('/:id', Auth.authorize([Role.Admin, Role.Moderator], true), User.getUser);
userRouter.get('/allInfo/:id', Auth.authorize([Role.Admin, Role.Moderator], true), User.getUserWithAllInfo);

userRouter.put('/:id', Auth.authorize([Role.Admin], true), User.updateUser);