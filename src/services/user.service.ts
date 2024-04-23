import { User } from "../models/user.model.ts";
import { emailAlreadyExist, pseudoAlreadyExist } from "../validators/registration.validator.ts";

const register = async (user: User) => {
    let flag = await pseudoAlreadyExist(user?.pseudo);
    if(!!flag) {
        throw new Error(`Le pseudo '${user?.pseudo}' existe déjà !`);
    }

    flag = await emailAlreadyExist(user?.email);
    if(!!flag) {
        throw new Error(`L'adresse email '${user?.email}' existe déjà !`);
    }

    const newUser = await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        pseudo: user.pseudo,
        email: user.email,
        walletAdress: user.walletAdress,
        certified: true,
        country: user.country,
        referral: user.referral,
    });

    await newUser.save();
}

const getUserByWallet = async (wallet: string) => {
    const user = await User.findOne(
        { where:
            { walletAdress: wallet }
        });
    return user;
}

const getUsers = async () => {
    const users = await User.findAll();
    return users;
}

export { register, getUserByWallet, getUsers }