import { User } from '../models/user.model';

const usernameAlreadyExist = async (username: string): Promise<number | null> => {
    const exist = await User.count({ where: { username: username } });

    return exist;
};

const emailAlreadyExist = async (email: string): Promise<number | null> => {
    const exist = await User.count({ where: { email: email } });
    return exist;
};

const referralExist = async (referral: string): Promise<number | null> => {
    const exist = await User.count({ where: { referralCode: referral } });

    return exist;
};

const walletAdressAlreadyExist = async (walletAdress: string): Promise<number | null> => {
    const exist = await User.count({ where: { walletAdress: walletAdress } });
  
    return exist;
};

export { usernameAlreadyExist, emailAlreadyExist, referralExist, walletAdressAlreadyExist };
