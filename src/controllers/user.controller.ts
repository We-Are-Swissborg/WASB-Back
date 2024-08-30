import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import { referralExist } from '../validators/user.validator';
import * as userRepository from '../repository/user.repository';

// const addUser = async (req: Request, res: Response) => {
//   const user = plainToInstance(req.body, User, { groups: ['register']});
//   console.log(user);
//   res.status(201).json({ message: "Utilisateur ajouté avec succès" });
// };

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

const getUser = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        const user: User | null = await userRepository.getUserById(id);

        if (user instanceof User) {
            const userDTO = instanceToPlain(user, { groups: ['user'], excludeExtraneousValues: true });
            res.status(200).json(userDTO);
        } else {
            res.status(400).json(`This user doesn't exist`);
        }
    } catch (e) {
        logger.error(`getUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

const checkReferralExist = async (req: Request, res: Response) => {
    try {
        const codeRef: string = req.params.codeRef;
        const referral: number | null = await referralExist(codeRef);

        if (referral) {
            res.status(200).json({ referral });
        } else {
            res.status(400).json({ message: `Referral doesn't exist` });
        }
    } catch (e) {
        logger.error(`checkReferralExist error`, e);
        res.status(500).json({ message: 'Oops !, referral not exist.' });
    }
};

const getUserWithAllInfo = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        const user: User | null = await userRepository.getUserByIdWithAllInfo(id);
        let userDTO = null;

        if (user instanceof User) {
            userDTO = instanceToPlain(user, { groups: ['profil'], excludeExtraneousValues: true });
            res.status(200).json(userDTO);
        } else {
            res.status(400).json(`This user doesn't exist`);
        }
    } catch (e) {
        logger.error(`getUserWithAllInfo error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        const user = plainToClass(User, req.body as string, { groups: ['user'] });

        logger.info(`Update User`, user)

        if (user.id == id) {
            await userRepository.update(user);
            res.status(204).end();
        } else {
            res.status(400).json(`An error in your user form`);
        }
    } catch (e) {
        logger.error(`updateUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

const patchUser = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        logger.info('patchUser', { userId: id });
        await userRepository.setUser(id, req.body);

        res.status(204).end();
    } catch (e) {
        logger.error(`updateUser error`, e);
        res.status(500).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getUser, getAllUsers, checkReferralExist, updateUser, getUserWithAllInfo, patchUser };
