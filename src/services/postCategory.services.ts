import { logger } from '../middlewares/logger.middleware';
import { PostCategory } from '../models/postcategory.model';
import * as categoryRepository from '../repository/postCategory.repository';

/**
 * Create a new category
 * @param {PostCategory} category new category
 * @returns {Promise<PostCategory>} new category
 */
const create = async (category: PostCategory): Promise<PostCategory> => {
    logger.info('create category : services');

    category.title = category.title.trim();

    if (!category.title) {
        throw new Error('A title for the category is required');
    }

    if (category.title.length < 3) {
        throw new Error('A title for the category must contain more than 3 characters');
    }

    category = await categoryRepository.create(category);

    return category;
};

const getCategory = async (id: number) => {
    logger.info('getCategory : services', { id: id });

    const category = await categoryRepository.findById(id);

    logger.debug(`getCategory`);

    return category;
};

const getCategories = async () => {
    logger.info('getCategories : services');

    const categories = await categoryRepository.findAll();

    logger.debug(`getCategories : ${categories.length} item(s)`);

    return categories;
};

/**
 * Update a category
 * @param {PostCategory} category Update category
 * @returns {Promise<PostCategory>} Update category
 */
const update = async (id: number, updatedcategory: PostCategory): Promise<PostCategory> => {
    logger.info('update category : services');

    if (id !== updatedcategory.id) {
        throw new Error('The encoded data do not coincide with those supplied');
    }

    if (!updatedcategory.title) {
        throw new Error('A title for the category is required');
    }

    if (updatedcategory.title.length < 3) {
        throw new Error('A title for the category must contain more than 3 characters');
    }

    updatedcategory = await categoryRepository.update(updatedcategory);
    return updatedcategory;
};

export { create, getCategory, getCategories, update };
