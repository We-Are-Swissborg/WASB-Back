import { logger } from '../middlewares/logger.middleware';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import * as RegistValidator from '../validators/user.validator';
import Register from '../types/Register';
import { getIdReferent, loginByUsername } from '../repository/user.repository';

/**
 * New user registration
 * @param {Register} user
 * @returns {Promise<User>} new user
 */
const register = async (user: Register): Promise<User> => {
    logger.info('registration new user', user);
    let flag = await RegistValidator.usernameAlreadyExist(user.username);
    let referent = null;

    if (flag) {
        throw new Error(`Username '${user.username}' already exist !`);
    }

    flag = await RegistValidator.emailAlreadyExist(user.email);
    if (flag) {
        throw new Error(`Email '${user.email}' already exist !`);
    }

    if (user.referralCode) {
        referent = await getIdReferent(user.referralCode);
        logger.debug('referent', referent);

        if (!referent) throw new Error(`Referral '${user.referralCode}' is incorrect !`);
    }

    const password: string = await bcrypt.hash(user.password, 12);

    const u = await User.create({
        username: user.username,
        email: user.email,
        password: password,
        confidentiality: user.confidentiality,
        beContacted: user.beContacted,
        referringUserId: referent?.id,
    });

    logger.debug('user created', u);

    return u;
};

/**
 *
 * @param {string} username user login
 * @param {string} plaintextPassword user plaintext password
 * @returns {Promise<User>} user
 */
const login = async (username: string, plaintextPassword: string): Promise<User> => {
    logger.info(`login`, { login: login });
    const user = await loginByUsername(username);
    const errorMessage = `Authentication is not valid for this username or password`;

    if (!plaintextPassword) throw new Error(errorMessage);

    if (!user) throw new Error(errorMessage);
    const response = await bcrypt.compare(plaintextPassword, user?.password);
    if (!response) throw new Error(errorMessage);

    return user;
};

const updateLastLogin = (user: User): void => {
    user.lastLogin = new Date();
    user.save();
};

export { register, login, updateLastLogin };
