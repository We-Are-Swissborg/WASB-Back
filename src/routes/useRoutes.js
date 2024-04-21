import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { register } from "../controllers/security.controller.js";
const router = express.Router();

router.post("/register", register)
router.get("/users", getAllUsers)

export { router };