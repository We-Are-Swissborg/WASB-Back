import express, { Router } from 'express';
import * as Session from '../controllers/session.controller';

export const sessionRouter: Router = express.Router();

sessionRouter.get('/', Session.getSessions);
sessionRouter.get('/:slug', Session.getSession);
