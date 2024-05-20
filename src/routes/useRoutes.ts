import express from 'express';
import { getAllUsers } from '../controllers/user.controller';
import * as Security from '../controllers/security.controller';
import * as Auth from './../middlewares/auth.middleware';

export const router = express.Router();

router.post('/register', Security.registration);
router.post('/auth', Security.auth);

router.get('/users', Auth.authorize(), getAllUsers);
