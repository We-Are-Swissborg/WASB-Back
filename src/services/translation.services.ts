import { Logger } from "winston";
import { ITranslation, Translation } from "../models/translation.model";
import { EntityType } from "../enums/entityType.enum";
import { Transaction } from "sequelize";
import TranslationRepository from "../repository/translation.repository";
import domClean from "./domPurify";


export default class TranslationService {
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
                throw new Error(`A title for the ${entityType} is required`); 
            }

            if (entityType == EntityType.POST)
            {
                t.content = domClean(t.content!);
                if (!t.content?.trim()) { throw new Error(`A content for the ${entityType} is required`); }
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
            await this.translationRepository.update(translation);            
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