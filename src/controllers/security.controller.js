
import { register } from "../services/user.service.js";

const register = async (req, res) => {
    try
    {
        const newUser = req.body;
        await register(newUser);
        res.status(201).json({ message: "Utilisateur ajouté avec succès" });
    }
    catch(e)
    {
        res.status(400).json({ message: e.message });
    }
};

export { register }