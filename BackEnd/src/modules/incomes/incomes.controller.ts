import { Request, Response } from "express";
import { IncomesService } from "./incomes.service";

const service = new IncomesService();

export const createIncome = async (req: Request, res: Response) => {
  try {
    await service.CreateIncome(req.body);
    res.status(200).send({ message: "Income Created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};

export const getHistoryIncomesAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const data = await service.getIncomeHistory(accountId.toString());
    res.status(201).json({ message: "Historial encontrado", data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

