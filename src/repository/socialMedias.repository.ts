import { ISocialMedias, SocialMedias } from '../models/socialmedias.model';
import { logger } from '../middlewares/logger.middleware';
import * as SocialMediasValidator from '../validators/socialMedias.validator';

/**
 * Create Social Medias
 * @param data
 */
const create = async (data: SocialMedias): Promise<void> => {
    await data.save();
};

/**
 * Update Social Medias
 * @param data
 */
const update = async (data: SocialMedias): Promise<void> => {
    data.isNewRecord = false;
    await data.save();
};

const setSocialMedias = async (id: number, data: ISocialMedias): Promise<boolean | null> => {
    logger.info('social medias update', data);
    let flag: number | null = null;

    // Transform value empty to null, otherwise error not unique is returned
    Object.keys(data).forEach((prop) => {
        if (data[prop as keyof ISocialMedias]?.toString().trim() == '') data[prop as keyof ISocialMedias] = null;
    });

    if (data.twitter) flag = await SocialMediasValidator.twitterAlreadyExist(data.twitter);
    if (flag) {
        throw new Error(`X '${data.twitter}' already exist !`);
    }

    if (data.discord) flag = await SocialMediasValidator.discordAlreadyExist(data.discord);
    if (flag) {
        throw new Error(`Discord '${data.discord}' already exist !`);
    }

    if (data.telegram) flag = await SocialMediasValidator.telegramAlreadyExist(data.telegram);
    if (flag) {
        throw new Error(`Telegram '${data.telegram}' already exist !`);
    }

    if (data.tiktok) flag = await SocialMediasValidator.telegramAlreadyExist(data.tiktok);
    if (flag) {
        throw new Error(`Tiktok '${data.tiktok}' already exist !`);
    }

    const socialMediasUser = await SocialMedias.findOrCreate({
        where: { userId: id },
        defaults: { ...data },
    });

    // If an user already has social medias update social media
    if (!socialMediasUser[1]) {
        await SocialMedias.update(data, {
            where: { userId: id },
        });
    }

    logger.debug('update social medias user ', socialMediasUser);

    return !!socialMediasUser;
};

export { setSocialMedias, create, update };
