import { logger } from '../middlewares/logger.middleware';
import { Membership } from '../models/membership.model';
import * as MembershipRepository from '../repository/membership.repository';

/**
 * Create association membership application
 * @param membership membership application
 * @returns
 */
const createMembership = async (membership: Membership): Promise<Membership> => {
    logger.info('createMembership : services', membership);

    if (!membership.userId) {
        throw new Error('User not defined');
    }

    if (!membership.contributionId) {
        throw new Error('Contribution not defined');
    }

    const alreadyExist = await MembershipRepository.checkIfAlreadyAffiliate(membership.userId);
    if (alreadyExist) {
        throw new Error('You already have a membership');
    }
    logger.debug('response checkIfAlreadyAffiliate', { alreadyExist: alreadyExist });

    const membershipCreated = await MembershipRepository.create(membership);

    //TODO: not here
    // const user = await UserRepository.getUserById(membership.userId);
    // user?.addRoles([Role.Member]);
    // await UserRepository.update(user!);

    logger.debug('Membership created', { membership: membershipCreated });

    return membershipCreated;
};

/**
 * Retrieve all memberships by user
 * @param userId user identifiant
 * @returns
 */
const getAllMembershipsByUser = async (userId: number): Promise<Membership[]> => {
    logger.info('getAllMembershipsByUser : services', { userId: userId });

    return await MembershipRepository.getAllMembershipsByUser(userId);
};

export { createMembership, getAllMembershipsByUser };
