
import { Request, Response } from "express";
import { register } from "../services/user.service";

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

export { registration }