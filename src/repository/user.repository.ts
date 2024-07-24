import { Op } from 'sequelize';
import { User } from '../models/user.model';

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

/**
 * Retrieves a user's data to authenticate them
 * @param {string} username username
 * @returns {Promise<User | null>} User or null
 */
const loginByUsername = async (username: string): Promise<User | null> => {
    if (!username) return null;

    return await User.findOne({
        attributes: ['password', 'username', 'roles', 'walletAddress', 'id'],
        where: {
            username: username,
        },
    });
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
            referralCode: referral,
        },
    });

    return user;
};

export {
    getUserById,
    getUsers,
    getUsersWithSocialNetworks,
    getIdReferent,
    getUserByWallet,
    getUserNonce,
    loginByUsername,
};