import express, { Router } from 'express';
import * as Category from '../controllers/postCategory.controller';
import * as Auth from '../middlewares/auth.middleware';
import Role from '../types/Role';

export const categoryRouter: Router = express.Router();

categoryRouter.get('/', Category.getCategories);
categoryRouter.get('/:id', Category.getCategory);
categoryRouter.post('/', Auth.authorize([Role.Author]), Category.createCategory);
categoryRouter.put('/:id', Auth.authorize([Role.Author]), Category.updateCategory);
categoryRouter.delete('/:id', Auth.authorize([Role.Author]), Category.deleteCategory);
