import express, { Router } from 'express';
import * as Category from '../../controllers/adminController/postCategoryAdmin.controller';

export const categoryRouter: Router = express.Router();

categoryRouter.get('/', Category.getCategories);
categoryRouter.get('/:id', Category.getCategory);
categoryRouter.post('/', Category.createCategory);
categoryRouter.put('/:id', Category.updateCategory);
categoryRouter.delete('/:id', Category.deleteCategory);
