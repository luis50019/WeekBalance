import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createProfile, getProfileById } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register/", authMiddleware, createProfile);
authRouter.post("/profile/", authMiddleware, getProfileById);
