import { Request, Response } from "express";
import { ExpensesService } from "./expense.service";

const service = new ExpensesService();

export const createExpense = async (req: Request, res: Response) => {
  try {
    await service.createExpense(req.body);
    res.status(201).json({ message: "Gasto registrado" });
  } catch (e: any) {
    console.log("Error creating expense:", e);
    res.status(400).json({ error: "Error al registrar el nuevo gasto" });
  }
};

export const getHistoryExpensesById = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const data = await service.getExpensesHistoryByAccount(
      accountId.toString(),
    );
    res.status(201).json({ message: "Historial encontrado", data: data });
  } catch (e: any) {
    res
      .status(400)
      .json({ error: "Errro al obtener el historial de la cuenta" });
  }
};

export const getExpensesByCategory = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId as string;
    const data = await service.getExpensesByCategory(accountId);
    res.status(200).json({ message: "Gastos por categoría obtenidos", data });
  } catch (e: any) {
    console.error("Error getting expenses by category:", e);
    res.status(400).json({ error: e.message || "Error al obtener gastos por categoría" });
  }
};

export const getWeeklyExpenseTotal = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId as string;
    const total = await service.getWeeklyExpenseTotal(accountId);
    res.status(200).json({ message: "Total de gastos semanales", data: { total } });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

