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

export const getHistorySavingAccount = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    console.log("ide ---" + id);
    const data = await service.getsSavingHistory(id);
    res.status(201).json({ message: "Historial encontrado", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
};
