import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IUser, User } from '../models/user.model';
import bcrypt from 'bcrypt';
import * as RegistValidator from '../validators/registration.validator';
import { generateRandomCode } from '../utils/generator';

/**
 * New user registration
 * @param user
 * @returns new user
 */
const register = async (user: IUser): Promise<IUser> => {
    logger.info('register', user);
    let flag = await RegistValidator.pseudoAlreadyExist(user.pseudo);
    if (flag) {
        throw new Error(`Pseudo '${user.pseudo}' already exist !`);
    }

    flag = await RegistValidator.emailAlreadyExist(user.email);
    if (flag) {
        throw new Error(`Email '${user.email}' already exist !`);
    }

    if(user.referral) flag = await RegistValidator.referralExist(user.referral);
    if (!flag && user.referral) {
        throw new Error(`Referral '${user.referral}' is incorrect !`);
    }
    const password: string = await bcrypt.hash(user.password, 12);
    const codeRef: string = await getCode();

    const u = await User.create({
        pseudo: user.pseudo,
        email: user.email,
        password: password,
        referral: user.referral,
        confidentiality: user.confidentiality,
        beContacted: user.beContacted,
        codeRef: codeRef,
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

const getCode = async (): Promise<string> => {
    let codeRef = '';
    const lengthCode = 5;

    while(!codeRef) {
        codeRef = generateRandomCode(lengthCode); 
        if(codeRef.length === lengthCode) {
            const exist = await User.count({where: { codeRef: codeRef }});
            if(exist) codeRef = '';
        }
    }
    return codeRef;
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
    getCode
};