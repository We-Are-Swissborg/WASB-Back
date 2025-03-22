import { Transaction } from "sequelize";
import { ITranslation, Translation } from "../models/translation.model";
import { logger as defaultLogger } from "../middlewares/logger.middleware";
import { Logger } from "winston";

class TranslationRepository {
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
    async bulkCreate(translations: Omit<ITranslation, "id">[], transaction?: Transaction): Promise<Translation[]> {
        this.logger.info("translations bulk create", translations);
        
        try {
            return await Translation.bulkCreate(translations, { transaction });
        } catch (error) {
            this.logger.error("Error in bulkCreate", { error });
            throw new Error("Failed to create translations");
        }
    }

    /**
     * Met à jour plusieurs traductions
     * @param {ITranslation[]} translations
     * @param {Transaction} [transaction]
     * @returns {Promise<Translation[]>}
     */
    async bulkUpdate(translations: Translation[], transaction?: Transaction): Promise<Translation[]> {
        this.logger.info("translations bulk update", translations);

        try {
            return await Translation.bulkCreate(translations, {
                transaction,
                updateOnDuplicate: ["title"],
            });
        } catch (error) {
            this.logger.error("Error in bulkUpdate", { error });
            throw new Error("Failed to update translations");
        }
    }

    /**
     * Met à jour une traduction
     * @param {ITranslation} translations
     * @param {Transaction} [transaction]
     * @returns {Promise<Translation>}
     */
    // async update(translation: ITranslation, transaction?: Transaction): Promise<ITranslation> {
    //     this.logger.info("translations update", translation);

    //     try {
    //         await translation.save({ transaction });
    //         return translation;
    //         // return await Translation.update(translation, 
    //         //     transaction,
    //         // );
    //     } catch (error) {
    //         this.logger.error("Error in update", { error });
    //         throw new Error("Failed to update translations");
    //     }
    // }
}

export default TranslationRepository;
