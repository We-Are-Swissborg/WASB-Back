import { CookieOptions, Request, Response } from 'express';
import { login, register, updateLastLogin } from '../services/user.services';
import { generateToken, generateRefreshToken, validateRefreshToken } from '../services/jwt.services';
import { plainToInstance } from 'class-transformer';
import { logger } from '../middlewares/logger.middleware';
import Register from '../types/Register';
import { TokenPayload } from '../types/TokenPayload';
import { getUserByEmail, getUserById, setPasswordByMail } from '../repository/user.repository';
import { fortgetMail, getMailToken, sendMail } from '../services/mail.services';
import { cache } from '../cache/cacheManager';

const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
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

/**
 * Check email exist.
 *
 * @param req Request
 * @param res Response
 */
const checkEmail = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const user = await getUserByEmail(email);

        if(!user) throw new Error('Email is not valid');
        
        res.status(200).end();
    } catch (e: unknown) {
        logger.error(`Check email error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
}

/**
 * Check email and username.
 *
 * @param req Request
 * @param res Response
 */
const checkUsernameAndEmail = async (req: Request, res: Response) => {
    logger.info('Check username and email');

    try {
        const email = req.body.email;
        const username = req.body.username;
        const lang = req.params.lang;
        const user = await getUserByEmail(email);
        const mailZohoToken = await cache.get('mailZohoToken');

        if(user?.username !== username) throw new Error('Username is not valid');
        if(!mailZohoToken) await getMailToken();

        const data = await fortgetMail(lang, email, username);
        await sendMail(data);

        res.status(200).end();
    } catch (e: unknown) {
        logger.error(`Check username and email error`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
}

/**
 * Reset password with link sent by mail.
 *
 * @param req Request
 * @param res Response
 */
const resetPassword = async (req: Request, res: Response) => {
    logger.info('Reset password');

    try {
        const newPassword = req.body.newPassword;
        const slug = req.params.slug;
        const email: string | null = await cache.get(slug);

        if(!email) throw new Error('Reset password expired');

        await setPasswordByMail(email, newPassword);

        res.status(200).end();
    } catch (e: unknown) {
        logger.error(`Error to reset password`, e);
        if (e instanceof Error) res.status(400).json({ message: e.message });
    }
}

export {
    registration,
    authCredentials,
    refreshToken,
    checkEmail,
    checkUsernameAndEmail,
    resetPassword
};
