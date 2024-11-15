import { logger } from '../middlewares/logger.middleware';
import { Contribution } from '../models/contribution.model';

/**
 * Create a new contribution
 * @param contribution 
 * @returns 
 */
const create = async (contribution: Contribution): Promise<Contribution> => {
    logger.info('contribution create', contribution);

    const contributionCreated = await contribution.save();

    logger.debug('contribution created');

    return contributionCreated;
};

/**
 * Retrieve contribution by identifiant
 * @param id 
 * @returns 
 */
const getContribution = async (id: number): Promise<Contribution | null> => {
    logger.info('getContribution', { id: id });

    const contribution = await Contribution.findByPk(id);

    logger.debug('getContribution : contribution', { contribution: contribution });

    return contribution;
};

/**
 * Retrieve all active contributions 
 * @returns 
 */
const getActiveContributions = async (): Promise<Contribution[]> => {
    logger.info('getActiveContributions');

    const contributions = await Contribution.findAll({
        where: {
            isActive: true,
        }
    });

    logger.debug('getActiveContributions : contributions', { contributions: contributions });

    return contributions;
};

/**
 * Retrieve all contributions 
 * @returns 
 */
const getContributions = async (): Promise<Contribution[]> => {
    logger.info('getContributions');

    const contributions = await Contribution.findAll();

    logger.debug('getContributions : contributions', { contributions: contributions });

    return contributions;
};

/**
 * 
 * @param id 
 */
const destroy = async (id: number): Promise<void> => {
    logger.info(`delete contribution ${id}`);

    await Contribution.destroy({ where: { id: id } });

    logger.debug(`delete contribution ${id}`);
};

/**
 * 
 * @param contribution 
 */
const update = async (contribution: Contribution): Promise<void> => {
    logger.info(`update contribution ${contribution.id}`);

    contribution.isNewRecord = false;
    await contribution.save();

    logger.debug(`updated contribution ${contribution.id}!`);
};

export { create, getContribution, getContributions, getActiveContributions, destroy, update };
