import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as Security from '../controllers/security.controller';
import { getAllUsers, getUser, checkReferralExist } from '../controllers/user.controller';

export const userRouter: Router = express.Router();

userRouter.get('/codeRef/:codeRef', checkReferralExist);
userRouter.get('/', Auth.authorize(), getAllUsers);
userRouter.get('/:id', Auth.authorize(), getUser);

userRouter.post('/register', Security.registration);
userRouter.post('/auth', Security.authCredentials);
userRouter.post('/authWallet', Security.authWallet);
userRouter.post('/nonce', Security.nonce);
