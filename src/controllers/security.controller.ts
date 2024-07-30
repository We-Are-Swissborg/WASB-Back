import { Request, Response } from 'express';
import { login, register, updateLastLogin } from '../services/user.services';
import { generateToken } from '../services/jwt.services';
import { plainToInstance } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import Register from '../types/Register';

/**
 * Register a new member
 *
 * @param req Request
 * @param res Response
 */
const registration = async (req: Request, res: Response) => {
    try {
        const form: string = req.body;
        const user: Register = plainToInstance(Register, form, { groups: ['register'] });
        const admin = false; // Set up when role ok
        const newUser = await register(user);

        if (admin) {
            res.status(201);
        } else {
            const token = generateToken(newUser);
            res.status(201).json({ token });
        }
    } catch (e: unknown) {
        logger.error(`User registration error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Authenticates a user with credentials
 *
 * @param req Request
 * @param res Response
 */
const authCredentials = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        logger.info(`Attempt authCredentials`, { username: username });

        const user = await login(username, password);
        updateLastLogin(user);
        const token = generateToken(user);

        res.status(200).json({ token: token });
    } catch (e: unknown) {
        logger.error(`User auth error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { registration, authCredentials };
