import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as SocialMedias from '../controllers/socialMedias.controller';

export const socialMediasRouter: Router = express.Router();

socialMediasRouter.put('/:userId', Auth.authorize(), SocialMedias.updateSocialMediasUser);