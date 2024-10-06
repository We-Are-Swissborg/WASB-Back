import express, { Router } from 'express';
import * as Parameter from '../../controllers/adminController/parameterAdmin.controller';

export const parameterRouter: Router = express.Router();

parameterRouter.get('/', Parameter.getParameters);
parameterRouter.get('/:id', Parameter.getParameter);
parameterRouter.post('/', Parameter.createParameter);
parameterRouter.put('/:id', Parameter.updateParameter);
parameterRouter.delete('/:id', Parameter.deleteParameter);
