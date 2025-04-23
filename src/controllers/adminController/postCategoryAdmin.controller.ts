import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { PostCategory } from '../../models/postcategory.model';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
import * as categoryService from '../../services/postCategory.services';
import * as categoryRepository from '../../repository/postCategory.repository';

/**
 * Create category
 * @param req
 * @param res
 */
const createCategory = async (req: Request, res: Response) => {
    logger.info(`Create Category`);

    try {
        const category = plainToClass(PostCategory, req.body as string, { groups: ['admin'] });

        try {
            await categoryService.create(category);
            res.status(200).end();
        } catch (e: unknown) {
            if (e instanceof Error) res.status(400).json(e.message);
        }
    } catch (e: unknown) {
        logger.error(`createCategory error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Update category
 * @param req
 * @param res
 */
const updateCategory = async (req: Request, res: Response) => {
    logger.info(`Update Category`);

    try {
        const id: number = Number(req.params.id);
        const category = plainToClass(PostCategory, req.body as string, { groups: ['admin'] });

        logger.info('updateCategory', category);

        if (category.id == id) {
            await categoryService.update(id, category);
            res.status(204).end();
        } else {
            res.status(400).json(`An error in your category form`);
        }
    } catch (e) {
        logger.error(`updateCategory error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Delete category
 * @param req
 * @param res
 */
const deleteCategory = async (req: Request, res: Response) => {
    logger.info(`Delete Category`, { id: req.params.id });

    try {
        const id: number = Number(req.params.id);
        await categoryRepository.destroy(id);
        res.status(200);
    } catch (e) {
        logger.error(`deleteCategory error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Retrieve all categories
 * @param req
 * @param res
 */
const getCategories = async (req: Request, res: Response) => {
    logger.info(`Get Categories`);

    try {
        const categories = await categoryService.getCategories();
        const categoriesDTO = instanceToPlain(categories, { groups: ['admin'], excludeExtraneousValues: true });
        res.status(200).json(categoriesDTO);
    } catch (e) {
        logger.error(`getCategories error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Retrieve category
 * @param req
 * @param res
 */
const getCategory = async (req: Request, res: Response) => {
    logger.info(`Get Category`);

    try {
        const id: number = Number(req.params.id);
        const category = await categoryService.getCategory(id);

        if (category instanceof PostCategory) {
            const categoryDTO = instanceToPlain(category, { groups: ['admin'], excludeExtraneousValues: true });
            res.status(200).json(categoryDTO);
        } else {
            res.status(404).json({ message: 'No records found' });
        }
    } catch (e) {
        logger.error(`getCategory error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { createCategory, updateCategory, deleteCategory, getCategory, getCategories };
