import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import { instanceToPlain } from 'class-transformer';
import * as ContributionServices from '../services/contribution.services';

const fileNameLogger = 'contributionController';

/**
 * Retrieve contributions
 * @param req 
 * @param res 
 */
const getContributions = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getContributions ->`);

    try {
        const contributions = await ContributionServices.getActiveContributions();

        const contributionsDTO = instanceToPlain(contributions, { groups: ['user'], excludeExtraneousValues: true });
        res.status(200).json(contributionsDTO);
    } catch (e: unknown) {
        logger.error(`Get contribution error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { getContributions };
