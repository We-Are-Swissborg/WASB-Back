import { CookieOptions, Request, Response } from 'express';
import { login, register, updateLastLogin } from '../services/user.services';
import { generateToken, generateRefreshToken, validateRefreshToken } from '../services/jwt.services';
import { plainToInstance } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import Register from '../types/Register';
import { TokenPayload } from '../types/TokenPayload';
import { getUserById } from '../repository/user.repository';

const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
}

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
        const isAdmin = false; // Set up when role ok
        const newUser = await register(user);

        if (isAdmin) {
            res.status(201);
        } else {
            const token = generateToken(newUser);

            const refreshToken = generateRefreshToken(newUser);
            res.cookie('jwt', refreshToken, cookieOptions);

            res.status(201).json({ token });
        }
    } catch (e: unknown) {
        logger.error(`User registration error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Authenticates an user with credentials
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

        const refreshToken = generateRefreshToken(user);
        res.cookie('jwt', refreshToken, cookieOptions);

        res.status(200).json({ token: token });
    } catch (e: unknown) {
        logger.error(`User auth error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
};

/**
 * Refresh token for an user.
 *
 * @param req Request
 * @param res Response
 */
const refreshToken = async (req: Request, res: Response) => {
    try {
        if (req.cookies?.jwt) {
            const refreshToken = req.cookies.jwt;
            const decodedRefreshToken: TokenPayload = validateRefreshToken(refreshToken) as TokenPayload;
            logger.debug('refresh token jwt decodedRefreshToken', decodedRefreshToken.username);
            const user = await getUserById(decodedRefreshToken.userId);
            const userInfo = req.body.userInfo;

            if(user && user.id === userInfo.userId && user.username === userInfo.username) {
                const token = generateToken(user);
                const newRefreshToken = generateRefreshToken(user);

                res.cookie('jwt', newRefreshToken, cookieOptions);
                res.status(200).json({ token: token });
            }
            else res.status(498).json({ message: 'Error refreshToken' });
        } 
        else res.status(406).json({ message: 'Jwt cookie no valid' });
    } catch (e: unknown) {
        logger.error(`Refresh token error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
}

export { registration, authCredentials, refreshToken };
