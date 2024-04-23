import { User } from "../models/user.model.ts";

const pseudoAlreadyExist = async (pseudo: string) => {
    const exist = await User.findOne(
        { where:
            { pseudo: pseudo }
        }
    );

    return exist;
}

const emailAlreadyExist = async (email: string) => {
    const exist = await User.findOne(
        { where:
            { email: email }
        }
    );

    return exist;
}

export { pseudoAlreadyExist, emailAlreadyExist }