import { Request, Response } from 'express';
import { getUserByWallet, register } from '../services/user.service';
import { generateToken } from '../services/jwt.services';
import { plainToInstance } from 'class-transformer';
import { IUser, User } from '../models/user.model';
import { logger } from '../middlewares/logger.middleware';

/**
 * Register a new member
 *
 * @param req Request
 * @param res Response
 */
const registration = async (req: Request, res: Response) => {
    try {
        const form: string = req.body;
        const newUser: IUser = plainToInstance(User, form, { groups: ['register'] });
        await register(newUser);
        res.status(201).json({ message: 'User successfully added' });
    } catch (e: unknown) {
        logger.error(`User registration error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Authenticates a user
 *
 * @param req Request
 * @param res Response
 */
const auth = async (req: Request, res: Response) => {
    try {
        const wallet = req.body;
        const user: User | null = await getUserByWallet(wallet.walletAddress);

        if (!user) {
            throw new Error(`This wallet has not yet been registered`);
        }

        const token = generateToken(user as IUser);

        res.status(200).json({ token: token });
    } catch (e: unknown) {
        logger.error(`User auth error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { registration, auth };
