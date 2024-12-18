import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
import * as MembershipServices from '../../services/membership.services';
import { Membership } from '../../models/membership.model';
import { ContributionWorkflow } from '../../workflows/contribution.workflow';
import { UpdatedStatusMembership } from '../../types/UpdatedStatusMembership';

const fileNameLogger = 'membershipAdminController';

/**
 * Retrieve Membership
 * @param req
 * @param res
 */
const getMemberships = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getMemberships ->`);

    try {
        const memberships = await MembershipServices.getMemberships();
        const membershipsDTO = instanceToPlain(memberships, { groups: ['admin'], excludeExtraneousValues: true });

        res.status(200).json(membershipsDTO);
    } catch (e: unknown) {
        logger.error(`Get memberships error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Retrieve Membership
 * @param req
 * @param res
 */
const getMembership = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: getMembership ->`);

    try {
        const id: number = Number(req.params.id);
        const membership = await MembershipServices.getMembership(id);

        if (membership instanceof Membership) {
            const membershipDTO = instanceToPlain(membership, { groups: ['admin'], excludeExtraneousValues: true });
            res.status(200).json(membershipDTO);
        } else {
            res.status(404).json({ message: 'No records found' });
        }
    } catch (e: unknown) {
        logger.error(`Get membership error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Change status Membership
 * @param req
 * @param res
 */
const changeStatusMembership = async (req: Request, res: Response) => {
    logger.info(`${fileNameLogger}: changeStatusMembership ->`);

    try {
        const id: number = Number(req.params.id);
        const membership = await MembershipServices.getMembership(id);

        if (membership instanceof Membership) {
            const updatedStatusMembership = plainToClass(UpdatedStatusMembership, req.body as string, {
                groups: ['admin'],
            });
            membership.note = updatedStatusMembership.note;
            logger.debug(`${fileNameLogger}: changeStatusMembership ->`, updatedStatusMembership);

            let updatedMembership = await ContributionWorkflow.transitionTo(
                updatedStatusMembership.contributionStatus,
                { membership, validateUserId: updatedStatusMembership.validatedBy, note: updatedStatusMembership.note },
            );

            if (updatedMembership.id === membership.id) {
                updatedMembership = await MembershipServices.updatedMembership(updatedMembership);
            }

            res.status(200).json(updatedMembership);
        } else {
            res.status(400).json({ message: `An error in your parameter form` });
        }
    } catch (e: unknown) {
        logger.error(`Change Status Membership error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { getMemberships, getMembership, changeStatusMembership };
