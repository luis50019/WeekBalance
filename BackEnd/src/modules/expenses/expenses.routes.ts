import { Router } from "express";
import { createExpense } from "./expenses.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const expensesRouter = Router();

expensesRouter.post("/register/", authMiddleware, createExpense);
expensesRouter.post("/history/", authMiddleware, createExpense);
