import { Request, Response } from 'express';
import { login, register, updateLastLogin } from '../services/user.services';
import { confirmSignMessage, generateNonce } from '../services/security.services';
import { generateToken } from '../services/jwt.services';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IUser } from '../models/user.model';
import { logger } from '../middlewares/logger.middleware';
import { Register } from '../types/Register';

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
        const newUser: IUser = await register(user);

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
 * Generate Nonce for user
 *
 * @param req Request
 * @param res Response
 */
const nonce = async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.body;

        const user = await generateNonce(walletAddress);
        const userDTO = instanceToPlain(user, { groups: ['auth'], excludeExtraneousValues: true });
        res.status(200).json(userDTO);
    } catch (e: unknown) {
        logger.error(`nonce error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Authenticates a user with credential
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

/**
 * Authenticates a user with wallet
 *
 * @param req Request
 * @param res Response
 */
const authWallet = async (req: Request, res: Response) => {
    try {
        const { walletAddress, signedMessageHash } = req.body;
        logger.info(`Attempt authWallet`, req.body);

        const user = await confirmSignMessage(walletAddress, signedMessageHash);
        updateLastLogin(user);
        const token = generateToken(user);

        res.status(200).json({ token: token });
    } catch (e: unknown) {
        logger.error(`User auth error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

export { registration, authCredentials, authWallet, nonce };
