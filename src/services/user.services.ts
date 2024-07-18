import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IUser, User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { emailAlreadyExist, pseudoAlreadyExist } from '../validators/registration.validator';

/**
 * New user registration
 * @param user
 * @returns new user
 */
const register = async (user: IUser): Promise<IUser> => {
    logger.info('register', user);
    let flag = await pseudoAlreadyExist(user.pseudo);
    if (flag) {
        throw new Error(`Le pseudo '${user.pseudo}' existe déjà !`);
    }

    flag = await emailAlreadyExist(user.email);
    if (flag) {
        throw new Error(`L'adresse email '${user.email}' existe déjà !`);
    }

    if(user.referral) flag = await getUserByReferral(user.referral);
    if (!flag && user.referral) {
        throw new Error(`Le code référent '${user.referral}' est incorrect !`);
    }
    const password: string = await bcrypt.hash(user.password, 12);
    const referralId: string = await getReferralId();

    const u = await User.create({
        pseudo: user.pseudo,
        email: user.email,
        password: password,
        referral: user.referral,
        confidentiality: user.confidentiality,
        beContacted: user.beContacted,
        referralId: referralId,
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

const generateReferralId = (): string => {
    let referralId = '';
    let lengthReferral = 0;
    const letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    while(lengthReferral < 5) {
        const randomNumber = Math.floor(Math.random() * 10);
        const letterOrNumber = Math.floor(Math.random() * 2);

        if(letterOrNumber === 0) referralId += letterArray[randomNumber];
        if(letterOrNumber === 1) referralId += randomNumber;

        ++lengthReferral;
    }
    return referralId;
};

const getReferralId = async (): Promise<string> => {
    let referralId = '';
    while(!referralId) {
        referralId = generateReferralId(); 
        const user = await User.findOne({ where: { referralId: referralId } });
        if(user) referralId = '';
    }
    return referralId;
};

const getUserByReferral = async (referral: string): Promise<User | null> => {
    const user = await User.findOne({ where: { referralId: referral } });
    return user;
};

const updateReferralUser = async (referral: User, user: IUser) => {
    const arrayReferred = JSON.parse(referral.userReferred);
    arrayReferred.push(user.id);

    await referral.update({
        ...referral,
        userReferred: JSON.stringify(arrayReferred),
    });
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
    getUserByReferral,
    updateReferralUser,
    getReferralId
};