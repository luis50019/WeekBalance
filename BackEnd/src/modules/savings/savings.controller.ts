import { Request, Response } from "express";
import { getHistoryAccount } from "../expenses/expenses.controller";
import { SavingService } from "./savings.service";

const service = new SavingService();

export const createIncome = async (req:Request, res:Response) => {
    try {
        await service.CreateSaving(req.body);
        res.status(200).send({message:"Ahorro registrado con exito"});
    } catch (error) {
        res.status(500).send({message:error});
    }
}

export const getHistorySavingAccount = async (req:Request, res:Response) => {
    try {
        const data = await service.getsSavingHistory(req.body);
        res.status(201).json({ message: "Historial encontrado", data: data });
    } catch (error) {
        res.status(500).send({message:error});
    }
}