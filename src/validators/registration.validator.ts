import { User } from '../models/user.model';

const pseudoAlreadyExist = async (pseudo: string): Promise<User | null> => {
    const exist = await User.findOne({ where: { pseudo: pseudo } });

    return exist;
};

const emailAlreadyExist = async (email: string): Promise<User | null> => {
    const exist = await User.findOne({ where: { email: email } });

    return exist;
};

export { pseudoAlreadyExist, emailAlreadyExist };
