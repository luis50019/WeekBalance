import { Request, Response } from "express";
import { ExpensesService } from "./expense.service";

const service = new ExpensesService();

export const createExpense = async (req: Request, res: Response) => {
  try {
    await service.createExpense(req.body);
    res.status(201).json({ message: "Gasto registrado" });
  } catch (e: any) {
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
    res
      .status(400)
      .json({ error: e.message || "Error al obtener gastos por categoría" });
  }
};

export const getWeeklyExpenseTotal = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId as string;
    const total = await service.getWeeklyExpenseTotal(accountId);
    res
      .status(200)
      .json({ message: "Total de gastos semanales", data: { total } });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getWeeklyExpensesByCategory = async (
  req: Request,
  res: Response,
) => {
  try {
    const accountId = req.params.accountId as string;
    const data = await service.getWeeklyExpensesByCategory(accountId);
    res.status(200).json({ message: "Gastos semanales por categoría", data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getWeeklyExpensesByDay = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId as string;
    const data = await service.getWeeklyExpensesByDay(accountId);
    res.status(200).json({ message: "Gastos diarios de la semana", data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getDailyExpenses = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId as string;
    const { startDate, endDate } = req.query;

    const data = await service.getDailyExpenses(
      accountId,
      startDate as string,
      endDate as string,
    );
    res.status(200).json({ message: "Gastos del día", data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    await service.updateExpense(req.body);
    res.status(200).json({ message: "Gasto actualizado" });
  } catch (e: any) {
    res
      .status(400)
      .json({ error: e.message || "Error al actualizar el gasto" });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await service.getExpenseById(id.toString());
    res.status(200).json({ message: "Gasto encontrado", data });
  } catch (e: any) {
    res.status(404).json({ error: e.message || "Gasto no encontrado" });
  }
};
