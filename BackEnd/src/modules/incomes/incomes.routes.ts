import { Router } from "express";
import { createIncome } from "./incomes.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const incomesRouter = Router();

incomesRouter.post("/add/",authMiddleware, createIncome);
incomesRouter.get("/history",authMiddleware, createIncome);

