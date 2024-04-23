import express from "express";
import { getAllUsers } from "../controllers/user.controller.js";
import { registration } from "../controllers/security.controller.js";
const router = express.Router();

router.post("/register", registration)
router.get("/users", getAllUsers)

export { router };