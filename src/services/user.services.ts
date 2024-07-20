import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IUser, User } from '../models/user.model';
import bcrypt from 'bcrypt';
import * as RegistValidator from '../validators/registration.validator';
import { Register } from '../types/Register';

/**
 * New user registration
 * @param user
 * @returns new user
 */
const register = async (user: Register): Promise<User> => {
    logger.info('registration new user', user);
    let flag = await RegistValidator.pseudoAlreadyExist(user.username);
    let referent = null;

    if (flag) {
        throw new Error(`Pseudo '${user.username}' already exist !`);
    }

    flag = await RegistValidator.emailAlreadyExist(user.email);
    if (flag) {
        throw new Error(`Email '${user.email}' already exist !`);
    }

    if(user.referralCode) {
        referent = await getIdReferent(user.referralCode);
        logger.debug('referent', referent);

        if(!referent) throw new Error(`Referral '${user.referralCode}' is incorrect !`);
    }

    const password: string = await bcrypt.hash(user.password, 12);

    const u = await User.create({
        pseudo: user.username,
        email: user.email,
        password: password,
        confidentiality: user.confidentiality,
        beContacted: user.beContacted,
        referringUserId: referent?.id
    });

    logger.debug('user created', u);

    return u;
};

/**
 *
 * @param login user login
 * @param plaintextPassword user plaintext password
 * @returns user
 */
const login = async (login: string, plaintextPassword: string): Promise<User> => {
    logger.info(`login`, { login: login });
    const user = await User.findOne({
        attributes: ['password', 'pseudo', 'roles', 'walletAddress', 'id'],
        where: {
            pseudo: login,
        },
    });

    if (!user) throw new Error(`Authentication is not valid for this pseudo or password`);
    const response = await bcrypt.compare(plaintextPassword, user?.password);
    if (!response) throw new Error(`Authentication is not valid for this pseudo or password`);

    return user;
};

const updateLastLogin = (user: User): void => {
    user.lastLogin = new Date();
    user.save();
};

const getUserByWallet = async (wallet: string): Promise<User | null> => {
    const user = await User.findOne({ where: { walletAddress: wallet } });
    return user;
};

const getUserById = async (identifiant: number): Promise<User | null> => {
    const user = await User.findByPk(identifiant);
    return user;
};

const getUsers = async (): Promise<User[]> => {
    const users = await User.findAll();
    return users;
};

const getUsersWithSocialNetworks = async (): Promise<User[]> => {
    const users = await User.findAll({
        include: 'socialNetwork',
    });
    return users;
};

const getUserNonce = async (wallet: string): Promise<User> => {
    const user = await User.findOne({
        where: {
            walletAddress: wallet,
            expiresIn: {
                [Op.gte]: new Date(),
            },
        },
    });

    if (!user) throw new Error(`Authentication is not valid for this wallet`);

    return user;
};

/**
 * Retrieve the identifier of the user to whom the referral code belongs
 * @param referral unique referral code
 * @returns user or null
 */
const getIdReferent = async (referral: string): Promise<User | null> => {
    const user = await User.findOne({
        attributes: ['id'],
        where: {
            referralCode: referral
        }
    });

    return user;
};

export {
    register,
    login,
    updateLastLogin,
    getUserByWallet,
    getUserById,
    getUsers,
    getUsersWithSocialNetworks,
    getUserNonce,
};