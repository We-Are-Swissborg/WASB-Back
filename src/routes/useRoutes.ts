import express from "express";
import { getAllUsers } from "../controllers/user.controller.ts";
import { registration } from "../controllers/security.controller.ts";
const router = express.Router();

router.post("/register", registration)
router.get("/users", getAllUsers)

export { router };