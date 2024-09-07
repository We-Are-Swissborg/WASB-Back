import { setSocialMedias } from '../repository/socialMedias.repository';
import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';

/**
 * Update social medias
 * @param req
 * @param res
 */
const updateSocialMediasUser = async (req: Request, res: Response) => {
    try {
        const userId: number = Number(req.params.id);
        const body = req.body;
        const socialMedias: boolean | null = await setSocialMedias(userId, body);

        if (socialMedias) {
            res.status(204).end();
        } else {
            res.status(400).json(`An error in your social medias form`);
        }
    } catch (e) {
        logger.error(`updateSocialMediasUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { updateSocialMediasUser };
