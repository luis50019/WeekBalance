import { Router } from "express";
import { createIncome } from "./incomes.controller";

export const incomesRouter = Router();

incomesRouter.post("/add/", createIncome);
incomesRouter.get("/history", createIncome);

