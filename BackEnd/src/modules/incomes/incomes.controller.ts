import { Request, Response } from "express";
import { IncomesService } from "./incomes.service";
import { getHistoryAccount } from "../expenses/expenses.controller";

const service = new IncomesService();

export const createIncome = async (req:Request, res:Response) => {
    try {
        await service.CreateIncome(req.body);
        res.status(200).send({message:"Income Created"});
    } catch (error) {
        res.status(500).send({message:error});
    }
}

export const getHistoryIncomesAccount = async (req:Request, res:Response) => {
    try {
        const data = await service.getIncomeHistory(req.body);
        res.status(201).json({ message: "Historial encontrado", data: data });
    } catch (error) {
        res.status(500).send({message:error});
    }
}