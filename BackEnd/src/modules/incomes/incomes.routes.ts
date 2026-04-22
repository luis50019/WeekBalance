import { Router } from "express";
import { createIncome, getHistoryIncomesAccount, getWeeklyIncomeTotal, updateIncome, getIncomeById } from "./incomes.controller";
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
incomesRouter.put("/update/", authMiddleware, updateIncome);
incomesRouter.get(
  "/:id",
  authMiddleware,
  getIncomeById,
);
