import express, { Router } from 'express';
import * as User from '../../controllers/adminController/userAdmin.controller';

export const userRouter: Router = express.Router();

userRouter.get('/', User.getAllUsers);
userRouter.post('/', User.createUser);
userRouter.get('/:id', User.getUserWithAllInfo);
userRouter.put('/:id', User.updateUser);
userRouter.delete('/:id', User.deleteUser);
