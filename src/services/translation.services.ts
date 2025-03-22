import { Logger } from "winston";
import { ITranslation, Translation } from "../models/translation.model";
import { EntityType } from "../enums/entityType.enum";
import { Transaction } from "sequelize";
import TranslationRepository from "../repository/translation.repository";


export class TranslationService {
    private translationRepository: TranslationRepository;

    constructor(private logger: Logger) 
    {
        this.translationRepository = new TranslationRepository(logger);
    }

    async bulkCreate(entityType: EntityType, entityId: number, translations: Omit<ITranslation, "id">[], transaction?: Transaction): Promise<void> {
        this.logger.info('TranslationService.bulkCreate - Start');

        for (const t of translations) {
            t.title = t.title.trim();
            
            if (!t.title?.trim()) { 
                throw new Error('A title for the category is required'); 
            }
            if (!t.languageCode?.trim()) { 
                throw new Error('A languageCode for the translation is required'); 
            }
    
            if (!t.entityType?.trim()) { 
                t.entityType = entityType;
            }

            t.entityId = entityId
        }

        try
        {
            await this.translationRepository.bulkCreate(translations, transaction);
        }
        catch(e)
        {
            this.logger.error('TranslationService.bulkCreate : Error', {error : e});
            throw e;
        }
        finally
        {
            this.logger.info('TranslationService.bulkCreate - End');
        }
    }

    async bulkUpdate(entityType: EntityType, translations: Translation[]): Promise<void> {
        this.logger.info('TranslationService.bulkUpdate - Start');

        for (const t of translations) {
            this.update(entityType, t);            
        }
    }

    async update(entityType: EntityType, translation: Translation): Promise<void> {
        
        translation.title = translation.title.trim();
    
        if (!translation.title?.trim()) { throw new Error('A title for the category is required'); }
        if (!translation.languageCode?.trim()) { throw new Error('A languageCode for the translation is required'); }

        if (!translation.entityType?.trim()) { 
            translation.entityType = entityType
        }

        try
        {
            const trans = await Translation.findByPk(translation.id);
            
            if(trans == null)
                throw("not possible");

            trans.title = translation.title.trim();
            trans.save();
            this.logger.info(`translation saved`, trans);
        }
        catch(e)
        {
            this.logger.error('TranslationService.update : Error', {error : e});
            throw e;
        }
        finally
        {
            this.logger.info('TranslationService.update - End');
        }
    }
}