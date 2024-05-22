import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { getUserById, getUsers } from '../services/user.service';
import { instanceToPlain } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';

// const addUser = async (req: Request, res: Response) => {
//   const user = plainToInstance(req.body, User, { groups: ['register']});
//   console.log(user);
//   res.status(201).json({ message: "Utilisateur ajouté avec succès" });
// };

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await getUsers();

        const usersDTO = instanceToPlain(users, { groups: ['user'], excludeExtraneousValues: true });
        res.status(200).json(usersDTO);
    } catch (e) {
        logger.error(`getAllUsers error`, e);
        res.status(500).json({ message: "Oops !, une erreur s'est produite." });
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id);
        const user: User | null = await getUserById(id);
        let userDTO = null;

        if (user instanceof User) {
            userDTO = instanceToPlain(user, { groups: ['user'], excludeExtraneousValues: true });
            res.status(200).json(userDTO);
        } else {
            res.status(400).json(`This user doesn't exist`);
        }
    } catch (e) {
        logger.error(`getUser error`, e);
        res.status(500).json({ message: "Oops !, une erreur s'est produite." });
    }
};

export { getUser, getAllUsers };
