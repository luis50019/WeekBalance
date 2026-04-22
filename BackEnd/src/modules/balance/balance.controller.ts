import { Request, Response } from "express";
import { BalanceService } from "./balance.service";

const balanceService = new BalanceService();

export const getMonthlyTrend = async (req: Request, res: Response) => {
  try {
    const accountId = req.query.accountId as string;
    
    if (!accountId) {
      res.status(400).json({ message: "accountId es requerido" });
      return;
    }

    const months = parseInt(req.query.months as string) || 6;
    const data = await balanceService.getMonthlyTrend(accountId, months);
    
    res.status(200).json({ 
      message: "Tendencia mensual obtenida",
      data 
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la tendencia mensual" });
  }
};

export const getWeeklyTrend = async (req: Request, res: Response) => {
  try {
    const accountId = req.query.accountId as string;
    
    if (!accountId) {
      res.status(400).json({ message: "accountId es requerido" });
      return;
    }

    const weeks = parseInt(req.query.weeks as string) || 6;
    const data = await balanceService.getWeeklyTrend(accountId, weeks);
    
    res.status(200).json({ 
      message: "Tendencia semanal obtenida",
      data 
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la tendencia semanal" });
  }
};
