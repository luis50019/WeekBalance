import { Request, Response } from "express";
import { ExpensesService } from "./expense.service";

const service = new ExpensesService();

export const createExpense = async (req: Request, res: Response) => {
  try {
    await service.createExpense(req.user.id, req.body);
    res.status(201).json({ message: "Gasto registrado" });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
