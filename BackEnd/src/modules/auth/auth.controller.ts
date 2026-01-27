import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export const createProfile = async (req: Request, res: Response) => {
  try {
    const data = await service.createProfile(req.body);
    console.log(data);
    res.status(201).json({ message: "Perfil creado", data: data });
  } catch (e: any) {
    console.log(e);
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

export const getInfoUser = async (req:Request,res:Response) =>{
  try {
    const { id } = req.params;
    const data = await service.getInfo(id);
    res.status(201).json({message:"Perfil encontrada",data:data})
  } catch (e:any) {
    console.log(e);
    res.status(400).json({ message: "Error al encontrar el perfil" });
  }
   
}
