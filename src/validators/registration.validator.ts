import { User } from '../models/user.model';

const pseudoAlreadyExist = async (pseudo: string): Promise<number | null> => {
    const exist = await User.count({ where: { pseudo: pseudo } });

    return exist;
};

const emailAlreadyExist = async (email: string): Promise<number | null> => {
    const exist = await User.count({ where: { email: email } });
    return exist;
};

export { pseudoAlreadyExist, emailAlreadyExist };