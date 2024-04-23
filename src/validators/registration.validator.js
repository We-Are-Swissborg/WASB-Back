import { User } from "../models/user.model.js";

const pseudoAlreadyExist = async (pseudo) => {
    const exist = await User.findOne(
        { where:
            { pseudo: pseudo }
        }
    );

    return exist;
}

const emailAlreadyExist = async (email) => {
    const exist = await User.findOne(
        { where:
            { email: email }
        }
    );

    return exist;
}

export { pseudoAlreadyExist, emailAlreadyExist }