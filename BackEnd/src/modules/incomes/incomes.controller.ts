import { Request, Response } from "express";
import { IncomesService } from "./incomes.service";
import { UpdateIncomeDto } from "./dto/update-income.dto";

const service = new IncomesService();

export const createIncome = async (req: Request, res: Response) => {
  try {
    await service.CreateIncome(req.body);
    res.status(200).send({ message: "Income Created" });
  } catch (error) {
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

export const getWeeklyIncomeTotal = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.accountId as string;
    const total = await service.getWeeklyIncomeTotal(accountId);
    res.status(200).json({ message: "Total de ingresos semanales", data: { total } });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const updateIncome = async (req: Request, res: Response) => {
  try {
    const dto: UpdateIncomeDto = req.body;
    await service.updateIncome(dto);
    res.status(200).send({ message: "Ingreso actualizado" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = await service.getIncomeById(id);
    res.status(200).json({ message: "Ingreso encontrado", data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
