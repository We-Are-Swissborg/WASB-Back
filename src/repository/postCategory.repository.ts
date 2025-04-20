import { Op, Transaction } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IPostCategory, PostCategory } from '../models/postcategory.model';
import { Translation } from '../models/translation.model';

/**
 * Create a new category
 * @param {PostCategory} category new category
 * @returns {Promise<Category>} new category
 */
const create = async (category: Partial<IPostCategory>, transaction?: Transaction): Promise<PostCategory> => {
    logger.info('category create', category);

    const newCategory = await PostCategory.create(category, { transaction });

    logger.debug('category created');

    return newCategory;
};

/**
 * Update a category
 * @param {PostCategory} category Update category
 * @returns {Promise<PostCategory>} Update category
 */
const update = async (category: PostCategory, transaction?: Transaction): Promise<PostCategory> => {
    logger.info('category update', category);

    category.isNewRecord = false;
    category = await category.save({ transaction });

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

    const category = await PostCategory.findByPk(id, {
        include: [
            {
                model: Translation,
                attributes: ['id', 'title', 'languageCode'],
                where: {
                    entityType: 'PostCategory',
                    entityId: { [Op.col]: 'PostCategory.id' },
                },
                required: true,
            },
        ],
    });

    logger.debug('findById', { category: category });

    return category;
};

/**
 * Retrieve all categories
 * @returns {Promise<PostCategory[]>} result
 */
const findAll = async (): Promise<PostCategory[]> => {
    logger.info('findAll category');

    const categories = await PostCategory.findAll({
        include: [
            {
                model: Translation,
                attributes: ['id', 'title', 'languageCode'],
                where: {
                    entityType: 'PostCategory',
                    entityId: { [Op.col]: 'PostCategory.id' },
                },
                required: true,
            },
        ],
    });

    logger.debug('findAll', { categories: categories });

    return categories;
};

export { create, update, destroy, findById, findAll };
