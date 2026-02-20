import { Router } from "express";
import { createIncome, getHistoryIncomesAccount } from "./incomes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const incomesRouter = Router();

incomesRouter.post("/add/", authMiddleware, createIncome);
incomesRouter.get(
  "/history/:accountId",
  authMiddleware,
  getHistoryIncomesAccount,
);
