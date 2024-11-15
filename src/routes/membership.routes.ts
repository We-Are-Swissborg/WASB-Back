import express, { Router } from 'express';
import * as Auth from '../middlewares/auth.middleware';
import * as Membership from '../controllers/membership.controller';

export const membershipRouter: Router = express.Router();

membershipRouter.get('/me', Auth.authorize(), Membership.getAllMembershipsByUser);
membershipRouter.post('/', Auth.authorize(), Membership.createMembership);