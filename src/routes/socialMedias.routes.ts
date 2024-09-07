import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as SocialMedias from '../controllers/socialMedias.controller';

export const socialMediasRouter: Router = express.Router({ mergeParams: true });

socialMediasRouter.patch('/', Auth.authorize(), SocialMedias.updateSocialMediasUser);
