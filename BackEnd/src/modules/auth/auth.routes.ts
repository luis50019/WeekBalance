import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createProfile, getInfoUser, getProfileById } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register/", authMiddleware, createProfile);
authRouter.get("/profile/:id", authMiddleware, getProfileById);
authRouter.get("/info/:id", authMiddleware, getInfoUser);
