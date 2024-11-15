import { logger } from "../middlewares/logger.middleware";
import { Contribution } from "../models/contribution.model";
import * as ContributionRepository from "../repository/contribution.repositoty";

/**
 * Create new formule to contribution
 * @param contribution membership application
 * @returns 
 */
const createContribution = async (contribution: Contribution): Promise<Contribution> => {
    logger.info('createContribution : services', contribution);

    if (!contribution.title) {
        throw new Error('Title not defined');
    }

    if (!contribution.amount) {
        throw new Error('Amount not defined');
    }

    if (!contribution.duration) {
        throw new Error('Duration not defined');
    }

    const contributionCreated = await ContributionRepository.create(contribution);

    logger.debug('Contribution created', { contribution: contributionCreated });

    return contributionCreated;
};

/**
 * Retrieve contribution
 * @param id identifiant
 * @returns 
 */
const getContribution = async (id: number): Promise<Contribution | null> => {
    logger.info('getContribution : services', {id: id});

    return await ContributionRepository.getContribution(id);
};

/**
 * Retrieve contributions
 * @returns 
 */
const getContributions = async (): Promise<Contribution[]> => {
    logger.info('getContributions : services');

    return await ContributionRepository.getContributions();
};

/**
 * Retrieve active contributions
 * @returns 
 */
const getActiveContributions = async (): Promise<Contribution[]> => {
    logger.info('getActiveContributions : services');

    return await ContributionRepository.getActiveContributions();
};

export {createContribution, getContribution, getContributions, getActiveContributions};