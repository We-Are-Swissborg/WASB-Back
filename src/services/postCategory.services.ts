import { EntityType } from '../enums/entityType.enum';
import { logger } from '../middlewares/logger.middleware';
import sequelize from '../models';
import { PostCategory } from '../models/postcategory.model';
import { ITranslation, Translation } from '../models/translation.model';
import * as categoryRepository from '../repository/postCategory.repository';
import * as translationRepository from '../repository/translation.repository';
import { TranslationService } from './translation.services';

const translationService = new TranslationService(logger);

/**
 * Create a new category
 * @param {PostCategory} category new category
 * @returns {Promise<PostCategory>} new category
 */
const create = async (category: PostCategory): Promise<PostCategory> => {
    logger.info('create PostCategory : services');

    const transaction = await sequelize.transaction();
    logger.info('create PostCategory : transaction create');

    try {
        const categoryCreated = await categoryRepository.create(category, transaction);
        logger.info('create PostCategory : categoryRepository.create', categoryCreated);
        
        await translationService.bulkCreate(EntityType.POSTCATEGORY, categoryCreated.id, category.translations, transaction);
        // await translationRepository.bulkCreate(translationsData, transaction);
        logger.info('create PostCategory : translationRepository.bulkCreate');

        await transaction.commit();
        logger.debug('PostCategory created', { categoryCreated });
        return categoryCreated;
    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de la création de la catégorie avec traductions :", error);
        throw error;
    }
    finally
    {
        logger.info('create PostCategory : end');
    }
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

    const transaction = await sequelize.transaction();
    logger.info('update PostCategory : transaction create');

    try {
        const categoryUpdated = await categoryRepository.update(updatedcategory, transaction);
        logger.info('update PostCategory : categoryRepository.update', updatedcategory);

        await translationService.bulkUpdate(EntityType.POSTCATEGORY, updatedcategory.translations);

        logger.info('update PostCategory : translationRepository.bulkUpdate');

        await transaction.commit();
        logger.debug('PostCategory updated', { categoryUpdated });
        return categoryUpdated;
    } catch (error) {
        await transaction.rollback();
        console.error("Erreur lors de la mise à jour de la catégorie avec traductions :", error);
        throw error;
    }
    finally
    {
        logger.info('update PostCategory : end');
    }
};

export { create, getCategory, getCategories, update };
