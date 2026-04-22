import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createProfile, getInfoUser, getProfileById, login, register, getAccountByUserId, updateProfile } from "./auth.controller";

export const authRouter = Router();

// Rutas públicas (sin autenticación)
authRouter.post("/login", login);
authRouter.post("/register", register);

// Rutas privadas (con autenticación)
authRouter.post("/profile/", authMiddleware, createProfile);
authRouter.get("/profile/:id", authMiddleware, getProfileById);
authRouter.patch("/profile/:id", authMiddleware, updateProfile);
authRouter.get("/info/:id", authMiddleware, getInfoUser);
authRouter.get("/account/:userId", authMiddleware, getAccountByUserId);
