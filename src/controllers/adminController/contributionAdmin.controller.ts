import { Request, Response } from 'express';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
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
        const contributionDTO = instanceToPlain(contributionCreated, {
            groups: ['admin'],
            excludeExtraneousValues: true,
        });
        res.status(201).json(contributionDTO);
    } catch (e: unknown) {
        logger.error(`Create contribution error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

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

        const contributionDTO = instanceToPlain(contribution, { groups: ['admin'], excludeExtraneousValues: true });

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
        logger.error(`Get contributions error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Update contribution
 * @param req
 * @param res
 */
const updateContribution = async (req: Request, res: Response) => {
    logger.info(`Update contribution`);

    try {
        const id: number = Number(req.params.id);
        const contribution = plainToClass(Contribution, req.body as string, { groups: ['admin'] });

        if (contribution.id == id) {
            const contributionUpdated = await ContributionServices.updateContribution(contribution);
            res.status(200).json(contributionUpdated);
        } else {
            res.status(400).json(`An error in your parameter form`);
        }
    } catch (e) {
        logger.error(`update Contribution error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Delete contribution
 * @param req
 * @param res
 */
const deleteContribution = async (req: Request, res: Response) => {
    logger.info(`Delete contribution`);

    try {
        const id: number = Number(req.params.id);
        await ContributionServices.destroy(id);
        res.status(204).end();
    } catch (e) {
        logger.error(`delete Contribution error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { createContribution, getContribution, getContributions, updateContribution, deleteContribution };
