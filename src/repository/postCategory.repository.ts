import { logger } from '../middlewares/logger.middleware';
import { PostCategory } from '../models/postcategory.model';

/**
 * Create a new category
 * @param {PostCategory} category new category
 * @returns {Promise<Category>} new category
 */
const create = async (category: PostCategory): Promise<PostCategory> => {
    logger.info('category create', category);

    const newCategory = await PostCategory.create({
        title: category.title,
    });

    logger.debug('category created');

    return newCategory;
};

/**
 * Update a category
 * @param {PostCategory} category Update category
 * @returns {Promise<PostCategory>} Update category
 */
const update = async (category: PostCategory): Promise<PostCategory> => {
    logger.info('category update', category);

    category.isNewRecord = false;
    category = await category.save();

    logger.debug('category updated');

    return category;
};

/**
 * Delete category
 * @param {number} id identifier of the category to be deleted
 */
const destroy = async (id: number): Promise<void> => {
    logger.info(`delete category ${id}`);

    const isDelete = await PostCategory.destroy({ where: { id: id } });
    if (!isDelete) throw new Error('Error, category not exist for delete');

    logger.debug(`delete category ${id}`);
};

/**
 * Retrieve category by identifient
 * @param {number} id identifient
 * @returns result
 */
const findById = async (id: number): Promise<PostCategory | null> => {
    logger.info(`findById category ${id}`);

    const category = await PostCategory.findByPk(id);

    logger.debug('findById', { category: category });

    return category;
};

/**
 * Retrieve all categories
 * @returns {Promise<PostCategory[]>} result
 */
const findAll = async (): Promise<PostCategory[]> => {
    logger.info('findAll category');

    const categories = await PostCategory.findAll();

    logger.debug('findAll', { categories: categories });

    return categories;
};

export { create, update, destroy, findById, findAll };
