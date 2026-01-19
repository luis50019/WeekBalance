import { Router } from "express";
import { createSaving, getHistorySavingAccount } from "./savings.controller";

export const savingRouter = Router();

savingRouter.post('/add/',createSaving)
savingRouter.get("/history/",getHistorySavingAccount)
