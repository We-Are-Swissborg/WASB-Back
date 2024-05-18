import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const secret: string = process.env.JWT_SECRET_KEY || 'my_secret_key';
const expires_in: string = process.env.JWT_EXPIRES_IN || '1d';

const signInOptions: SignOptions = {
    algorithm: "HS512",
    expiresIn: expires_in
}

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
const validateToken = (token: string): JwtPayload | string => {
    return verify(token, secret);
}

/**
 * generates JWT token
 * @param user the user's expected payload
 */
const generateToken = (user: IUser): string => {
    const payload = {
        wallet: user.walletAddress,
        userId: user.id,
        roles: []
    };

    return sign(payload, secret, signInOptions);
}

export { validateToken, generateToken }