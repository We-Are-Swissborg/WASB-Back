import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as Contribution from '../controllers/contribution.controller';

export const contributionRouter: Router = express.Router();

contributionRouter.get('/', Auth.authorize(), Contribution.getContributions);
