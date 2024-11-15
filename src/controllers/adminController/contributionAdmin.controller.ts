import { Request, Response } from 'express';
import { logger } from '../../middlewares/logger.middleware';
import { instanceToPlain, plainToClass } from 'class-transformer';
import * as ContributionServices from '../../services/contribution.services';
import { Contribution } from '../../models/contribution.model';

const fileNameLogger = 'contributionAdminController';

/**
 * Create new contribution
 * @param req 
 * @param res 
 */
const createContribution = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: createContribution ->`);

    try {
        const contribution = plainToClass(Contribution, req.body as string, { groups: ['admin'] });

        const contributionCreated = await ContributionServices.createContribution(contribution);
        const contributionDTO = instanceToPlain(contributionCreated, { groups: ['admin'], excludeExtraneousValues: true });
        res.status(201).json(contributionDTO);
    } catch (e: unknown) {
        logger.error(`Get post error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
}

/**
 * Retrieve contribution
 * @param req 
 * @param res 
 */
const getContribution = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getContribution ->`);

    try {
        const id: number = Number(req.params.id);
        const contribution = await ContributionServices.getContribution(id);
        if (!contribution) throw new Error('No contribution find');

        const contributionDTO = instanceToPlain(contribution, { groups: ['user'], excludeExtraneousValues: true });

        res.status(200).json(contributionDTO);
    } catch (e: unknown) {
        logger.error(`Get contribution error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Retrieve contributions
 * @param req 
 * @param res 
 */
const getContributions = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getContributions ->`);

    try {
        const contributions = await ContributionServices.getContributions();

        const contributionsDTO = instanceToPlain(contributions, { groups: ['admin'], excludeExtraneousValues: true });

        res.status(200).json(contributionsDTO);
    } catch (e: unknown) {
        logger.error(`Get posts list error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { createContribution, getContribution, getContributions };
