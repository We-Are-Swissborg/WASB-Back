import express, { Router } from 'express';
import * as Contribution from '../../controllers/adminController/contributionAdmin.controller';

export const contributionRouter: Router = express.Router();

contributionRouter.get('/', Contribution.getContributions);
contributionRouter.get('/:id', Contribution.getContribution);
contributionRouter.post('/', Contribution.createContribution);