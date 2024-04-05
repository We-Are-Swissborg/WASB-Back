import { User } from "../models/user.model.js";

const addUser = async (req, res) => {
  const newData = req.body;
  const existingDatas = await loadDatas();
  existingDatas.push(newData);
  await saveDatas(existingDatas);
  res.status(201).json({ message: "Utilisateur ajouté avec succès" });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Oops !, une erreur s'est produite." });
  }
};

export { getAllUsers, addUser }