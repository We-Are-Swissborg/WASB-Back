import { Op } from 'sequelize';
import { logger } from '../middlewares/logger.middleware';
import { IUser, User } from '../models/user.model';
import { emailAlreadyExist, pseudoAlreadyExist } from '../validators/registration.validator';

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

    const oldUser = await getUserByWallet(user.walletAddress);
    logger.info('oldUser', oldUser);

    if (!oldUser) throw new Error("Ce Wallet n'existe pas dans notre registre");

    await oldUser.update({
        firstName: user.firstName,
        lastName: user.lastName,
        pseudo: user.pseudo,
        email: user.email,
        walletAddress: user.walletAddress,
        certified: true,
        country: user.country,
        city: user.city,
        referral: user.referral,
        aboutUs: user.aboutUs,
        confidentiality: user.confidentiality,
        beContacted: user.beContacted,
    });
    logger.debug('oldUser updated', oldUser);

    return oldUser;
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

const getUserNonce = async (wallet: string): Promise<IUser | null> => {
    const user: IUser | null = await User.findOne({
        where: {
            walletAddress: wallet,
            expiresIn: {
                [Op.gte]: new Date(),
            },
        },
    });
    return user;
};

export { register, getUserByWallet, getUserById, getUsers, getUsersWithSocialNetworks, getUserNonce };
