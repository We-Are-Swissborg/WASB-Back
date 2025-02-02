import express, { Router } from 'express';
import * as Session from '../../controllers/adminController/sessionAdmin.controller';

export const sessionRouter: Router = express.Router();

sessionRouter.get('/', Session.getSessions);
sessionRouter.get('/:id', Session.getSession);
sessionRouter.post('/', Session.createSession);
sessionRouter.put('/:id', Session.updateSession);
sessionRouter.delete('/:id', Session.deleteSession);
