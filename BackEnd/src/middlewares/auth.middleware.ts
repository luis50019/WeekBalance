import { Request, Response, NextFunction } from "express";
import { getSupabaseClient } from "../config/supabase.client";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Token inválido" });
  }

  req.user = data.user;
  next();
};
