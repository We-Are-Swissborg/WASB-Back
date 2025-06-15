import { JwtPayload, SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { logger } from '../middlewares/logger.middleware';
import { StringValue } from "ms";

const secret: string = process.env.JWT_SECRET_KEY || 'my_secret_key';
const refreshSecret: string = process.env.REFRESH_JWT_SECRET_KEY || 'my_refresh_secret_key';
const jwtExpires: StringValue = process.env.JWT_EXPIRES_IN as StringValue || '60000';
const refreshJwtExpires: StringValue = process.env.REFRESH_JWT_EXPIRES_IN as StringValue || '2d';

const signInOptions: SignOptions = {
    algorithm: 'HS512',
    expiresIn: jwtExpires,
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
 * checks if JWT refresh token is valid
 *
 * @param refreshToken the expected token payload
 */
const validateRefreshToken = (refreshToken: string): JwtPayload | string => {
    const verifyOptions: VerifyOptions = {
        algorithms: ['HS512'],
    };

    return verify(refreshToken, refreshSecret, verifyOptions);
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
    signInOptions.expiresIn = jwtExpires;

    return sign(payload, secret, signInOptions);
};

/**
 * generates refresh JWT token
 * @param user the user's expected payload
 */
const generateRefreshToken = (user: User): string => {
    const payload = {
        userId: user.id,
        username: user.username,
    };
    logger.info(`new refresh token generated for user`, payload);

    signInOptions.expiresIn = refreshJwtExpires;

    return sign(payload, refreshSecret, signInOptions);
};

export { validateToken, generateToken, generateRefreshToken, validateRefreshToken };
