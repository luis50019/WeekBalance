import { Router } from "express";
import { createExpense, getHistoryExpensesById, getExpensesByCategory, getWeeklyExpenseTotal, getWeeklyExpensesByCategory, getWeeklyExpensesByDay, getDailyExpenses, updateExpense, getExpenseById } from "./expenses.controller";
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
expensesRouter.get(
  "/weekly-by-category/:accountId",
  authMiddleware,
  getWeeklyExpensesByCategory,
);
expensesRouter.get(
  "/weekly-by-day/:accountId",
  authMiddleware,
  getWeeklyExpensesByDay,
);
expensesRouter.get(
  "/daily/:accountId",
  authMiddleware,
  getDailyExpenses,
);
expensesRouter.put("/update/", authMiddleware, updateExpense);
expensesRouter.get("/:id", authMiddleware, getExpenseById);
