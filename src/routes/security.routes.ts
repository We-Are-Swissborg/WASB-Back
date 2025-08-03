import express, { Router } from 'express';
import * as Security from '../controllers/security.controller';
import * as SecurityWeb3 from '../controllers/security.web3.controller';

export const securityRouter: Router = express.Router();

securityRouter.post('/register', Security.registration);
securityRouter.post('/auth', Security.authCredentials);
securityRouter.post('/authWallet', SecurityWeb3.authWallet);
securityRouter.get('/getNonce', SecurityWeb3.getNonce);
securityRouter.post('/refresh', Security.refreshToken);
securityRouter.post('/checkEmail', Security.checkEmail);
securityRouter.post('/checkUsernameAndEmail/:lang', Security.checkUsernameAndEmail);
securityRouter.post('/resetPassword/:slug', Security.resetPassword);
