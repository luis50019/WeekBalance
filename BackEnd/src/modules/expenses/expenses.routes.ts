import { Router } from "express";
import { createExpense, getHistoryExpensesById } from "./expenses.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const expensesRouter = Router();

expensesRouter.post("/register/", authMiddleware, createExpense);
expensesRouter.get(
  "/history/:accountId",
  authMiddleware,
  getHistoryExpensesById,
);
