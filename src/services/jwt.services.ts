import { JwtPayload, SignOptions, VerifyOptions, sign, verify } from 'jsonwebtoken';
import { IUser } from '../models/user.model';

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
const generateToken = (user: IUser): string => {
    const payload = {
        wallet: user.walletAddress,
        userId: user.id,
        roles: user.roles,
    };

    return sign(payload, secret, signInOptions);
};

export { validateToken, generateToken };
