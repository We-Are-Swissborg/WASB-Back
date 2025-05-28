import express, { Router } from 'express';
import * as Session from '../controllers/session.controller';
import * as Auth from '../middlewares/auth.middleware';
import Role from '../types/Role';

export const sessionRouter: Router = express.Router();

sessionRouter.get('/', Session.getSessions);
sessionRouter.get('/:slug', Session.getSession);
sessionRouter.get('/:id', Auth.authorize([Role.Organizer]), Session.getSession);
sessionRouter.post('/', Auth.authorize([Role.Organizer]), Session.createSession);
sessionRouter.put('/:id', Auth.authorize([Role.Organizer]), Session.updateSession);
sessionRouter.delete('/:id', Auth.authorize([Role.Organizer]), Session.deleteSession);
