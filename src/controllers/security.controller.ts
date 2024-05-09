
import { Request, Response } from "express";
import { getUserByWallet, register } from "../services/user.service";
import { generateToken } from "../services/jwt.services";
import { User } from "../models/user";

const registration = async (req: Request, res: Response) => {
    try
    {
        const newUser = req.body;
        await register(newUser);
        res.status(201).json({ message: "Utilisateur ajouté avec succès" });
    }
    catch(e: unknown)
    {
        if (e instanceof Error)
            res.status(400).json({ message: e.message });
    }
};

const auth = async (req: Request, res: Response) => {
    try
    {
        const wallet = req.body;

        const user = await getUserByWallet(wallet.walletAdress);
        console.log(user as User);

        if(user as null) {
            throw new Error(`Ce wallet n'a pas encore été enregistré`);
        }

        const token = generateToken(user as User);
        console.log(token);

        return res.status(200).json({ token: token });
    }
    catch(e: unknown)
    {
        if (e instanceof Error)
            res.status(400).json({ message: e.message });
    }
}

export { registration, auth }