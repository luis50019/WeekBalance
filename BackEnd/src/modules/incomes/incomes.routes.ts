import { Router } from "express";
import { createIncome, getHistoryIncomesAccount, getWeeklyIncomeTotal } from "./incomes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const incomesRouter = Router();

incomesRouter.post("/add/", authMiddleware, createIncome);
incomesRouter.get(
  "/history/:accountId",
  authMiddleware,
  getHistoryIncomesAccount,
);
incomesRouter.get(
  "/weekly-total/:accountId",
  authMiddleware,
  getWeeklyIncomeTotal,
);
