import { JwtPayload, SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { logger } from '../middlewares/logger.middleware';

const secret: string = process.env.JWT_SECRET_KEY || 'my_secret_key';
const expires_in: string = process.env.JWT_EXPIRES_IN || '1d';

const signInOptions: SignOptions = {
    algorithm: 'HS512',
    expiresIn: expires_in,
};

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
const validateToken = (token: string): JwtPayload | string => {
    const verifyOptions: VerifyOptions = {
        algorithms: ['HS512'],
    };

    return verify(token, secret, verifyOptions);
};

/**
 * generates JWT token
 * @param user the user's expected payload
 */
const generateToken = (user: User): string => {
    const payload = {
        wallet: user.walletAddress,
        userId: user.id,
        username: user.username,
        roles: user.getRoles,
    };
    logger.info(`new token generated for user`, payload);

    return sign(payload, secret, signInOptions);
};

export { validateToken, generateToken };
