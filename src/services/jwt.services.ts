import { JwtPayload, SignOptions, sign, verify } from 'jsonwebtoken';
import { IUser } from '../models/user.model';

/// TODO: Placer ces valeurs dans un fichier config/env
const signInOptions: SignOptions = {
    algorithm: 'HS512',
    expiresIn: 60 * 60 * 24
}

/**
 * checks if JWT token is valid
 *
 * @param token the expected token payload
 */
const validateToken = (token: string): JwtPayload | string => {
    return verify(token, "my_secret_key");
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

    return sign(payload, "my_secret_key", signInOptions);
}

export { validateToken, generateToken }