import express from "express";
import cors from "cors";
import { json } from "body-parser";

//? Rutas
import { expensesRouter } from "./modules/expenses/expenses.routes"; 
import { incomesRouter } from "./modules/incomes/incomes.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { savingRouter } from "./modules/savings/savings.routes";

export const app = express();

//? Middlewares
app.use(cors());
app.use(json());

//? Rutas
app.use("/auth", authRouter);
app.use("/expenses", expensesRouter);
app.use("/incomes", incomesRouter);
app.use('/saving',savingRouter);