import { SocialMedias } from '../models/socialmedias.model';

const twitterAlreadyExist = async (twitter: string): Promise<number | null> => {
    const exist = await SocialMedias.count({ where: { twitter: twitter } });

    return exist;
};

const discordAlreadyExist = async (discord: string): Promise<number | null> => {
    const exist = await SocialMedias.count({ where: { discord: discord } });
    return exist;
};

const tiktokAlreadyExist = async (tiktok: string): Promise<number | null> => {
    const exist = await SocialMedias.count({ where: { tiktok: tiktok } });

    return exist;
};

const telegramAlreadyExist = async (telegram: string): Promise<number | null> => {
    const exist = await SocialMedias.count({ where: { telegram: telegram } });

    return exist;
};

export { twitterAlreadyExist, discordAlreadyExist, tiktokAlreadyExist, telegramAlreadyExist };
