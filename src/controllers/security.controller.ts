
import { Request, Response } from "express";
import { getUserByWallet, register } from "../services/user.service";
import { generateToken } from "../services/jwt.services";
import { plainToInstance } from "class-transformer";
import { IUser, User } from "../models/user.model";

/**
 * Register a new member
 *
 * @param req Request
 * @param res Response
 */
const registration = async (req: Request, res: Response) => {
    try
    {
        const form: string = req.body;
        const newUser: IUser = plainToInstance(User, form, { groups: ['register'] });
        await register(newUser);
        res.status(201).json({ message: "Utilisateur ajouté avec succès" });
    }
    catch(e: unknown)
    {
        if (e instanceof Error)
            res.status(400).json({ message: e.message });
    }
};

/**
 * Authenticates a user
 *
 * @param req Request
 * @param res Response
 */
const auth = async (req: Request, res: Response) => {
    try
    {
        const wallet = req.body;
        const user = await getUserByWallet(wallet.walletAddress);

        if(!user) {
            throw new Error(`Ce wallet n'a pas encore été enregistré`);
        }

        const token = generateToken(user as IUser);

        res.status(200).json({ token: token });
    }
    catch(e: unknown)
    {
        if (e instanceof Error)
            res.status(400).json({ message: e.message });
    }
}

export { registration, auth }