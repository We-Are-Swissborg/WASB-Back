import express, { Router } from 'express';
import { testWithAuth, testWithoutAuth } from '../controllers/test.controller';
import * as Auth from '../middlewares/auth.middleware';
import Role from '../types/Role';

export const testRouter: Router = express.Router();

testRouter.get('/withoutAuth', testWithoutAuth);
testRouter.get('/withAuth', Auth.authorize([Role.Member]), testWithAuth);
