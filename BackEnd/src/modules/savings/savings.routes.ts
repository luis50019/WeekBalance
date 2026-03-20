import { Router } from "express";
import { createSaving, getHistorySavingAccount, createWeeklyGoal, registerSaving, getWeeklyGoals, recalculateWeeklyGoal } from "./savings.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const savingRouter = Router();

savingRouter.post("/add/", authMiddleware, createSaving);
savingRouter.get("/history/:id", authMiddleware, getHistorySavingAccount);
savingRouter.post("/weekly-goal", authMiddleware, createWeeklyGoal);
savingRouter.post("/register", authMiddleware, registerSaving);
savingRouter.get("/weekly-goals", authMiddleware, getWeeklyGoals);
savingRouter.post("/recalculate", authMiddleware, recalculateWeeklyGoal);
