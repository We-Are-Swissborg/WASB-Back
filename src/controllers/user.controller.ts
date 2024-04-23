import { Request, Response } from "express";
import { User } from "../models/user.model.ts";
import { getUsers } from "../services/user.service.ts";

const addUser = async (req: Request, res: Response) => {
  const newData = req.body;
  // const existingDatas = await loadDatas();
  // existingDatas.push(newData);
  // await saveDatas(existingDatas);
  res.status(201).json({ message: "Utilisateur ajouté avec succès" });
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await getUsers();
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Oops !, une erreur s'est produite." });
  }
};

export { getAllUsers, addUser }