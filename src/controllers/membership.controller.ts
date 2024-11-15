import { Request, Response } from 'express';
import { logger } from '../middlewares/logger.middleware';
import { instanceToPlain, plainToClass } from 'class-transformer';
import * as MembershipServices from '../services/membership.services';
import { Membership } from '../models/membership.model';
import { getUserFromContext } from '../middlewares/auth.middleware';

const fileNameLogger = 'membershipController';

/**
 * Create user affiliations
 * @param req 
 * @param res 
 */
const createMembership = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: createMembership ->`);

    try {
        const userContext = getUserFromContext();

        const membership = plainToClass(Membership, req.body as string, { groups: ['user'] });
        membership.userId = userContext!.userId;

        const membershipCreated = await MembershipServices.createMembership(membership);
        const membershipDTO = instanceToPlain(membershipCreated, { groups: ['user'], excludeExtraneousValues: true });

        res.status(201).json(membershipDTO);
    } catch (e: unknown) {
        logger.error(`Get membership error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
}

// /**
//  * Retrieve last user affiliations
//  * @param req 
//  * @param res 
//  */
// const getMembership = async (req: Request, res: Response) => {
//     logger.info(`${fileNameLogger}: getMembership ->`);

//     try {
//         const post = await PostServices.getPostBySlug(req.params.slug);
//         if (!post) throw new Error('No post find');

//         const postDTO = instanceToPlain(post, { groups: ['post'], excludeExtraneousValues: true });

//         res.status(200).json(postDTO);
//     } catch (e: unknown) {
//         logger.error(`Get post error`, e);
//         if (e instanceof Error) res.status(400).json({ message: e.message });
//     }
// };

/**
 * Retrieve all user affiliations
 * @param req 
 * @param res 
 */
const getAllMembershipsByUser = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getAllMembershipsByUser ->`);

    try {
        const userContext = getUserFromContext();
        const memberships = await MembershipServices.getAllMembershipsByUser(userContext!.userId);

        const membershipsDTO = instanceToPlain(memberships, { groups: ['user'], excludeExtraneousValues: true });

        res.status(200).json(membershipsDTO);
    } catch (e: unknown) {
        logger.error(`Get all memberships by user error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { createMembership, getAllMembershipsByUser };
