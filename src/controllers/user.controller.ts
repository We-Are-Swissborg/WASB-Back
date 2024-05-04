import { Request, Response } from "express";
import { User } from "../models/user.model";
import { getUsers } from "../services/user.service";
import { instanceToPlain } from "class-transformer";

// const addUser = async (req: Request, res: Response) => {
//   const user = plainToInstance(req.body, User, { groups: ['register']});
//   console.log(user);
//   res.status(201).json({ message: "Utilisateur ajouté avec succès" });
// };

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await getUsers();

    const test = instanceToPlain(users, { groups: ['user'], excludeExtraneousValues: true })
    res.status(200).json(test);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Oops !, une erreur s'est produite." });
  }
};

export { getAllUsers }