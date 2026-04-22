import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const data = await service.login(email, password);
    res.status(200).json({ message: "Login exitoso", data });
  } catch (e: any) {
     res.status(401).json({ message: e.message || "El correo o la contraseña son incorrectos." });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const data = await service.register(email, password, full_name);
    res.status(201).json({ message: "Usuario creado", data });
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Error al crear usuario" });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const data = await service.createProfile(req.body);
    res.status(201).json({ message: "Perfil creado", data: data });
  } catch (e: any) {
    res.status(400).json({ message: "Error al crear el perfil" });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = await service.getProfile(id);
    res.status(201).json({ message: "Perfil encontrado", data: data });
  } catch (e: any) {
    res.status(400).json({ message: "Error al encontrar el perfil" });
  }
};

export const getInfoUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = await service.getInfo(id);
    res.status(201).json({ message: "Perfil encontrado", data: data });
  } catch (e: any) {
    res.status(400).json({ message: "Error al encontrar el perfil" });
  }
};

export const getAccountByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const data = await service.getAccountByUserId(userId);
    res.status(200).json({ message: "Cuenta encontrada", data });
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Error al obtener la cuenta" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const { full_name } = req.body;

    if (!full_name) {
      return res.status(400).json({ error: "El nombre completo es requerido" });
    }

    const data = await service.updateProfile(userId, { full_name });
    res.status(200).json({ message: "Perfil actualizado correctamente", data });
  } catch (e: any) {
    res.status(400).json({ error: e.message || "Error al actualizar el perfil" });
  }
};
