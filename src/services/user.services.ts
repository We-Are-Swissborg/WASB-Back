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
    const password: string = await bcrypt.hash(user.password, 12);

    //TOCHANGE 

    // const oldUser = await getUserByWallet(user.walletAddress);
    // logger.info('oldUser', oldUser);

    // if (!oldUser) throw new Error("Ce Wallet n'existe pas dans notre registre");

    // await updateUser(oldUser, user, 'all');

    // logger.debug('oldUser updated', oldUser);
    // const u = await User.create({
    //     pseudo: user.pseudo,
    //     email: user.email,
    //     password: password,
    //     confidentiality: user.confidentiality,
    //     beContacted: user.beContacted,
    // });
    // logger.debug('user created', u);

    // return u;
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

//TOCHANGE

// const getUserByPseudo = async (pseudo: string): Promise<User | null> => {
//     const user = await User.findOne({ where: { pseudo: pseudo } });
//     return user;
// };

// const updateUser = async (oldUser: User, user: IUser, update: string) => {
//     if(update === 'all') {
//         await oldUser.update({
//             firstName: user.firstName,
//             lastName: user.lastName,
//             pseudo: user.pseudo,
//             email: user.email,
//             walletAddress: user.walletAddress,
//             certified: true,
//             country: user.country,
//             city: user.city,
//             referral: user.referral,
//             aboutUs: user.aboutUs,
//             confidentiality: user.confidentiality,
//             beContacted: user.beContacted,
//         });
//     } else if(update === 'userReferred') {
//         const arrayReferred = JSON.parse(oldUser.userReferred);
//         arrayReferred.push(user.id);

//         await oldUser.update({
//             ...oldUser,
//             userReferred: JSON.stringify(arrayReferred),
//         });
//     }
// };

// export { register, getUserByWallet, getUserById, getUsers, getUsersWithSocialNetworks, getUserNonce, getUserByPseudo, updateUser };
// export {
//     register,
//     login,
//     updateLastLogin,
//     getUserByWallet,
//     getUserById,
//     getUsers,
//     getUsersWithSocialNetworks,
//     getUserNonce,
// };
