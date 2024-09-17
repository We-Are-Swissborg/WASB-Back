import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';
import { adminLogger as logger } from '../middlewares/logger.middleware';

/**
 * Retrieve all parameters
 * @param req
 * @param res
 */
const getParameters = async (req: Request, res: Response) => {
    try {
        // const users: User[] = await parameterRepository.getUsers();

        // const usersDTO = instanceToPlain(users, { groups: ['user'], excludeExtraneousValues: true });
        // res.status(200).json(usersDTO);
    } catch (e) {
        logger.error(`getParameters error`, e);
        res.status(400).json({ message: 'Oops !, an error has occurred.' });
    }
};

export { getParameters };
