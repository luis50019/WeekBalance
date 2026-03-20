import { Router } from "express";
import { getMonthlyTrend, getWeeklyTrend } from "./balance.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const balanceRouter = Router();

balanceRouter.get("/monthly-trend", authMiddleware, getMonthlyTrend);
balanceRouter.get("/weekly-trend", authMiddleware, getWeeklyTrend);
