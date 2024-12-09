import express, { Router } from 'express';
import * as Membership from '../../controllers/adminController/membershipAdmin.controller';

export const membershipRouter: Router = express.Router();

membershipRouter.get('/', Membership.getMemberships);
membershipRouter.get('/:id', Membership.getMembership);
membershipRouter.patch('/:id', Membership.changeStatusMembership);
