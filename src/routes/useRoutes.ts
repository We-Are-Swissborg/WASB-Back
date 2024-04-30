import express from "express";
import { getAllUsers } from "../controllers/user.controller";
import { registration } from "../controllers/security.controller";

export const router = express.Router();

router.post("/register", registration);
router.get("/users", getAllUsers);