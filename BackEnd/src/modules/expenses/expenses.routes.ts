import { Router } from "express";
import { createExpense, getHistoryExpensesById, getExpensesByCategory, getWeeklyExpenseTotal } from "./expenses.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const expensesRouter = Router();

expensesRouter.post("/register/", authMiddleware, createExpense);
expensesRouter.get(
  "/history/:accountId",
  authMiddleware,
  getHistoryExpensesById,
);
expensesRouter.get(
  "/by-category/:accountId",
  authMiddleware,
  getExpensesByCategory,
);
expensesRouter.get(
  "/weekly-total/:accountId",
  authMiddleware,
  getWeeklyExpenseTotal,
);
