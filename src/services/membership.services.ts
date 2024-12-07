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

/**
 * Retrieve all memberships in Status 'In Progress'
 * @param userId user identifiant
 * @returns
 */
const getMemberships = async (): Promise<Membership[]> => {
    logger.info('getMemberships : services');

    return await MembershipRepository.getMemberships();
};

/**
 * Retrieve membership by identifiant
 * @param userId user identifiant
 * @returns
 */
const getMembership = async (id: number): Promise<Membership | null> => {
    logger.info('getMembership : services');

    return await MembershipRepository.getMembership(id);
};

/**
 * Update Membership
 * @param userId user identifiant
 * @returns
 */
const updatedMembership = async (membership: Membership): Promise<Membership> => {
    logger.info('updatedMembership : services');

    return await MembershipRepository.update(membership);
};

export { createMembership, getAllMembershipsByUser, getMemberships, getMembership, updatedMembership };
