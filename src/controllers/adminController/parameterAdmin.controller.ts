import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
import { User } from '../../models/user.model';
import * as userRepository from '../../repository/user.repository';
import * as socialMediasRep from '../../repository/socialMedias.repository';

/**
 * Retrieve all parameters
 * @param req
 * @param res
 */
const getParameters = async (req: Request, res: Response) => {
    try {
        const users: User[] = await userRepository.getUsers();

        const usersDTO = instanceToPlain(users, { groups: ['user'], excludeExtraneousValues: true });
        res.status(200).json(usersDTO);
    } catch (e) {
        logger.error(`getParameters error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Update parameter
 * @param req
 * @param res
 */
const updateParameter = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        logger.info(`Update User`, req.body);

        const user = plainToClass(User, req.body as string, { groups: ['user'] });

        // Update of user roles
        if (req.body.roles) {
            user.addRoles(req.body.roles);
            logger.info(`Update User roles`, req.body.roles);
        }

        if (user.socialMedias) {
            user.socialMedias.userId = user.id;
        }

        if (user.id == id) {
            await userRepository.update(user);
            if (user.socialMedias && !user.socialMedias.id) {
                await socialMediasRep.create(user.socialMedias!);
            } else {
                await socialMediasRep.update(user.socialMedias!);
            }
            res.status(204).end();
        } else {
            res.status(400).json(`An error in your user form`);
        }
    } catch (e) {
        logger.error(`updateUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Delete parameter
 * @param req
 * @param res
 */
const deleteParameter = async (req: Request, res: Response) => {
    try {
        logger.info(`Delete Parameter`, req.params.id);
        const id: number = Number(req.params.id);
        userRepository.deleteUser(id)
        res.status(200).end();
    } catch (e) {
        logger.error(`deleteParameter error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Create user
 * @param req
 * @param res
 */
const createParameter = async (req: Request, res: Response) => {
    try {
        logger.info(`Create Parameter`);
    } catch (e) {
        logger.error(`createParameter error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getParameters, updateParameter, deleteParameter, createParameter };
