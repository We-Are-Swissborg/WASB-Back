import { SignOptions, sign, verify } from 'jsonwebtoken';
import { User } from '../models/user';

const signInOptions: SignOptions = {
    algorithm: 'HS512',
    expiresIn: 60 * 60
}

const JWTverify =  (token: string): boolean => {
    try
    {
        verify(token, "my_secret_key");
        console.log(`JWTverify - test -> ${JSON.stringify(test)}`);
    }
    catch(e)
    {
        return false;
    }
    return true;
}

const JWTsign = (user: User): string => {
    return sign({
        wallet: user.walletAdress
    }, "my_secret_key", signInOptions);
}

export { JWTverify, JWTsign }