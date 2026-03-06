import { Router } from "express";
import { createSaving, getHistorySavingAccount } from "./savings.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const savingRouter = Router();

savingRouter.post("/add/", authMiddleware, createSaving);
savingRouter.get("/history/:id", authMiddleware, getHistorySavingAccount);
