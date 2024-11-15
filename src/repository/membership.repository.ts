import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { Membership } from '../models/membership.model';
import ContributionStatus from '../types/ContributionStatus';

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

    const membership = await Membership.findByPk(id);

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
 * 
 * @param membership 
 */
const update = async (membership: Membership): Promise<void> => {
    logger.info(`update membership ${membership.id}`);

    membership.isNewRecord = false;
    await membership.save();

    logger.debug(`updated membership ${membership.id}!`);
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
                { endDateContribution: {[Op.gte] : new Date() }},
                { contributionStatus: ContributionStatus.IN_PROGRESS }
            ]
        }
    });

    return isExist > 0;
}

const getAllMembershipsByUser = async (userId: number): Promise<Membership[]> => {
    logger.info(`getAllMembershipsByUser : ${userId}`);

    const memberships = await Membership.findAll({
        where: {
            userId: userId,
        },
        order: [['endDateContribution', 'DESC']],
    });

    return memberships;
}

export { create, getMembership, destroy, update, checkIfAlreadyAffiliate, getAllMembershipsByUser };
