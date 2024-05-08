
import { Request, Response } from "express";
import { register } from "../services/user.service";
import { plainToInstance } from "class-transformer";
import { IUser, User } from "../models/user.model";

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

export { registration }