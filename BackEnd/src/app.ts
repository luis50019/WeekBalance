import express from "express";
import cors from "cors";
import { json } from "body-parser";

// Rutas
import { expensesRouter } from "./modules/expenses/expenses.routes"; 

export const app = express();

// Middlewares globales
app.use(cors());
app.use(json());

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/expenses", expensesRouter);
