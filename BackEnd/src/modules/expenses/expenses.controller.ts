import { Request, Response } from "express";
import { ExpensesService } from "./expense.service";

const service = new ExpensesService();

export const createExpense = async (req: Request, res: Response) => {
  try {
    await service.createExpense(req.body);
    res.status(201).json({ message: "Gasto registrado" });
  } catch (e: any) {
    console.log('Error creating expense:', e);  
    res.status(400).json({ error: "Error al registrar el nuevo gasto" });
  }
};

export const getHistoryExpensesById = async (req:Request,res:Response) =>{
  try {
    const data = await service.getExpensesHistoryByAccount(req.body);
    res.status(201).json({message:"Historial encontrado",data:data})
  } catch (e:any) {
    res.status(400).json({ error: "Errro al obtener el historial de la cuenta" });
  }
}