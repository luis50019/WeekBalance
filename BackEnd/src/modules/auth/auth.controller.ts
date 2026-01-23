import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export const createProfile = async (req: Request, res: Response) => {
  try {
    await service.createProfile(req.body);
    res.status(201).json({ message: "Profile creado" });
  } catch (e: any) {
    res.status(400).json({ message: "Error al crear el perfil" });
  }
};

export const getProfileById = async (req:Request,res:Response) =>{
  try {
    const { id } = req.params;
    const data = await service.getProfile(id);
    res.status(201).json({message:"Perfil encontrada",data:data})
  } catch (e:any) {
    res.status(400).json({ message: "Error al encontrar el perfil" });
  }
}