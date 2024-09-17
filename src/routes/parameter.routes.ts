import express, { Router } from 'express';
import * as Parameter from '../controllers/parameter.controller';

export const parameterRouter: Router = express.Router();

parameterRouter.get('/', Parameter.getParameters);