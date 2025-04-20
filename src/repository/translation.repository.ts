import { Transaction } from 'sequelize';
import { ITranslation, Translation } from '../models/translation.model';
import { logger as defaultLogger } from '../middlewares/logger.middleware';
import { Logger } from 'winston';

export default class TranslationRepository {
    private logger;

    constructor(loggerInstance: Logger = defaultLogger) {
        this.logger = loggerInstance;
    }

    /**
     * Insère plusieurs traductions
     * @param {Omit<ITranslation, "id">[]} translations
     * @param {Transaction} [transaction]
     * @returns {Promise<Translation[]>}
     */
    async bulkCreate(translations: Omit<ITranslation, 'id'>[], transaction?: Transaction): Promise<Translation[]> {
        this.logger.info('translations bulk create', translations);

        try {
            return await Translation.bulkCreate(translations, { transaction });
        } catch (error) {
            this.logger.error('Error in bulkCreate', { error });
            throw new Error('Failed to create translations');
        }
    }

    /**
     * Met à jour plusieurs traductions
     * @param {ITranslation[]} translations
     * @param {Transaction} [transaction]
     * @returns {Promise<Translation[]>}
     */
    async bulkUpdate(translations: Translation[], transaction?: Transaction): Promise<Translation[]> {
        this.logger.info('translations bulk update', translations);

        try {
            return await Translation.bulkCreate(translations, {
                transaction,
                updateOnDuplicate: ['title'],
            });
        } catch (error) {
            this.logger.error('Error in bulkUpdate', { error });
            throw new Error('Failed to update translations');
        }
    }

    /**
     * Met à jour une traduction
     * @param {Translation} translation
     * @returns {Promise<void>}
     */
    async update(translation: Translation): Promise<void> {
        this.logger.info('translations update', translation);
        const trans = await Translation.findByPk(translation.id);

        if (trans == null) throw new Error('not possible');

        trans.title = translation.title.trim();
        trans.content = translation.content?.trim();
        await trans.save();
        this.logger.info(`translation saved`, trans);
    }
}
