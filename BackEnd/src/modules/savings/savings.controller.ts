import { Request, Response } from "express";
import { SavingService } from "./savings.service";

const service = new SavingService();

export const createSaving = async (req: Request, res: Response) => {
  try {
    await service.CreateSaving(req.body);
    res.status(200).send({ message: "Ahorro registrado con exito" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const createWeeklyGoal = async (req: Request, res: Response) => {
  try {
    const { account_id, target_amount, week_start, week_end } = req.body;
    
    if (!account_id) {
      res.status(400).json({ message: "account_id es requerido" });
      return;
    }
    if (!target_amount || target_amount <= 0) {
      res.status(400).json({ message: "target_amount debe ser mayor a 0" });
      return;
    }
    if (!week_start || !week_end) {
      res.status(400).json({ message: "week_start y week_end son requeridos" });
      return;
    }

    const data = await service.createWeeklyGoal({
      account_id,
      target_amount,
      week_start,
      week_end,
    });
    
    res.status(201).json({ 
      message: "Meta semanal creada con exito",
      data 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al crear la meta semanal";
    res.status(500).json({ message: errorMessage });
  }
};

export const registerSaving = async (req: Request, res: Response) => {
  try {
    const { account_id, amount, week_start, week_end } = req.body;
    
    if (!account_id) {
      res.status(400).json({ message: "account_id es requerido" });
      return;
    }
    if (!amount || amount <= 0) {
      res.status(400).json({ message: "amount debe ser mayor a 0" });
      return;
    }
    if (!week_start || !week_end) {
      res.status(400).json({ message: "week_start y week_end son requeridos" });
      return;
    }

    const data = await service.registerSaving(account_id, amount, week_start, week_end);
    await service.recalculateWeeklyGoal(account_id, week_start, week_end);
    
    res.status(201).json({ 
      message: "Ahorro registrado con exito",
      data 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al registrar el ahorro";
    res.status(500).json({ message: errorMessage });
  }
};

export const getHistorySavingAccount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = await service.getsSavingHistory(id);
    res.status(201).json({ message: "Historial encontrado", data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getWeeklyGoals = async (req: Request, res: Response) => {
  try {
    const accountId = req.query.accountId as string;
    
    if (!accountId) {
      res.status(400).json({ message: "accountId es requerido" });
      return;
    }

    const data = await service.getWeeklyGoals(accountId);
    
    res.status(200).json({ 
      message: "Metas semanales obtenidas",
      data 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al obtener las metas semanales";
    res.status(500).json({ message: errorMessage });
  }
};

export const recalculateWeeklyGoal = async (req: Request, res: Response) => {
  try {
    const accountId = req.query.accountId as string;
    const weekStart = req.query.weekStart as string;
    const weekEnd = req.query.weekEnd as string;
    
    if (!accountId) {
      res.status(400).json({ message: "accountId es requerido" });
      return;
    }
    if (!weekStart || !weekEnd) {
      res.status(400).json({ message: "weekStart y weekEnd son requeridos" });
      return;
    }

    const result = await service.recalculateWeeklyGoal(accountId, weekStart, weekEnd);
    
    res.status(200).json({ 
      message: result.goalMet ? "Meta semanal completada" : "Meta no completada",
      goalMet: result.goalMet,
      currentAmount: result.currentAmount,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error al recalcular la meta semanal";
    res.status(500).json({ message: errorMessage });
  }
};
