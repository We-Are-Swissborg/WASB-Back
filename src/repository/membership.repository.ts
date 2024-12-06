import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { Membership } from '../models/membership.model';
import { ContributionStatus } from '../types/ContributionStatus';
import { User } from '../models/user.model';
import { Contribution } from '../models/contribution.model';

/**
 * Create a new membership
 * @param membership
 * @returns
 */
const create = async (membership: Membership): Promise<Membership> => {
    logger.info('membership create', membership);

    const membershipCreated = await membership.save();

    logger.debug('membership created');

    return membershipCreated;
};

const getMembership = async (id: number): Promise<Membership | null> => {
    logger.info('getMembership', { id: id });

    const membership = await Membership.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['username'],
                as: 'user',
            },
            {
                model: User,
                attributes: ['username'],
                as: 'validateBy',
                required: false,
            },
            {
                model: Contribution,
                attributes: ['title', 'duration', 'amount'],
            },
        ],
    });

    logger.debug('getMembership : membership', { membership: membership });

    return membership;
};

/**
 *
 * @param id
 */
const destroy = async (id: number): Promise<void> => {
    logger.info(`delete membership ${id}`);

    await Membership.destroy({ where: { id: id } });

    logger.debug(`delete membership ${id}`);
};

/**
 * Update membership
 * @param membership
 */
const update = async (membership: Membership): Promise<Membership> => {
    logger.info(`update membership ${membership.id}`);

    membership.isNewRecord = false;
    membership = await membership.save();

    logger.debug(`updated membership ${membership.id}!`);
    return membership;
};

/**
 *
 */
const checkIfAlreadyAffiliate = async (userId: number): Promise<boolean> => {
    logger.info(`checkIfAlreadyAffiliate : ${userId}`);

    const isExist = await Membership.count({
        where: {
            userId: userId,
            [Op.or]: [
                { endDateContribution: { [Op.gte]: new Date() } },
                { contributionStatus: ContributionStatus.IN_PROGRESS },
            ],
        },
    });

    return isExist > 0;
};

const getAllMembershipsByUser = async (userId: number): Promise<Membership[]> => {
    logger.info(`getAllMembershipsByUser : ${userId}`);

    const memberships = await Membership.findAll({
        where: {
            userId: userId,
        },
        order: [['endDateContribution', 'DESC']],
        include: [
            {
                model: Contribution,
                attributes: ['title', 'duration', 'amount'],
            },
        ],
    });

    return memberships;
};

const getMebershipInProgress = async (): Promise<Membership[]> => {
    logger.info(`getMebershipInProgress`);

    const memberships = await Membership.findAll({
        where: {
            contributionStatus: ContributionStatus.IN_PROGRESS,
        },
        order: [['createdAt', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username'],
                as: 'user',
            },
            {
                model: User,
                attributes: ['username'],
                as: 'validateBy',
                required: false,
            },
        ],
    });

    logger.info(`getMebershipInProgress retrieve`, memberships);

    return memberships;
};

export {
    create,
    getMembership,
    destroy,
    update,
    checkIfAlreadyAffiliate,
    getAllMembershipsByUser,
    getMebershipInProgress,
};
