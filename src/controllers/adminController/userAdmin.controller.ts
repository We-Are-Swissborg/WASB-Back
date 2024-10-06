import { Request, Response } from 'express';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { adminLogger as logger } from '../../middlewares/logger.middleware';
import { User } from '../../models/user.model';
import * as userRepository from '../../repository/user.repository';
import * as socialMediasRep from '../../repository/socialMedias.repository';

/**
 * Retrieve all users
 * @param req
 * @param res
 */
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await userRepository.getUsers();

        const usersDTO = instanceToPlain(users, { groups: ['user'], excludeExtraneousValues: true });
        res.status(200).json(usersDTO);
    } catch (e) {
        logger.error(`getAllUsers error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Retrive all informations for an user
 * @param req
 * @param res
 */
const getUserWithAllInfo = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        const user: User | null = await userRepository.getUserByIdWithAllInfo(id);
        let userDTO = null;

        if (user instanceof User) {
            userDTO = instanceToPlain(user, { groups: ['user'], excludeExtraneousValues: true });
            res.status(200).json(userDTO);
        } else {
            res.status(404).json(`This user doesn't exist`);
        }
    } catch (e) {
        logger.error(`getUserWithAllInfo error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Update user
 * @param req
 * @param res
 */
const updateUser = async (req: Request, res: Response) => {
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
 * Delete user
 * @param req
 * @param res
 */
const deleteUser = async (req: Request, res: Response) => {
    try {
        logger.info(`Delete User`, req.params.id);
        const id: number = Number(req.params.id);
        userRepository.deleteUser(id);
        res.status(200).end();
    } catch (e) {
        logger.error(`deleteUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Create user
 * @param req
 * @param res
 */
const createUser = async (req: Request, res: Response) => {
    try {
        logger.info(`Create User`);
    } catch (e) {
        logger.error(`createUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

/**
 * Change status of user
 * @param req
 * @param res
 */
const changeStatusUser = async (req: Request, res: Response) => {
    try {
        logger.info(`Cahge Status User`);
    } catch (e) {
        logger.error(`changeStatusUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getAllUsers, updateUser, getUserWithAllInfo, deleteUser, createUser, changeStatusUser };
