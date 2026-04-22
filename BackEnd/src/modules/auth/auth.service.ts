import { AuthRepository } from "./auth.repository";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { validate as isUUID } from "uuid";
import supabase from "@supabase/supabase-js";
import { env } from "../../config/env";

export class AuthService {
  constructor(private readonly repo = new AuthRepository()) {}

  private getPublicSupabaseClient() {
    return supabase.createClient(
      env.supabase.url!,
      env.supabase.serviceRoleKey!
    );
  }

  async login(email: string, password: string) {
    const supabase = this.getPublicSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Check if it's an invalid credentials error
         if (error.message?.toLowerCase().includes("invalid login")) {
             throw new Error("El correo o la contraseña son incorrectos.");
         }
        throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Usuario no encontrado");
    }

    // Obtener perfil y cuenta del usuario
    const profile = await this.repo.findByID(data.user.id);
    const account = await this.repo.getAccountByUserId(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      profile,
      account,
      session: data.session,
    };
  }

  async register(email: string, password: string, full_name: string) {
    const supabase = this.getPublicSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes("already been registered") || errorMessage.includes("already exists")) {
        throw new Error("El correo ya está registrado");
      }
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Error al crear usuario");
    }

    // Crear perfil y cuenta en la base de datos
    const profile = await this.repo.create(data.user.id, full_name);

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      profile,
    };
  }

  async createProfile(
    dto: CreateAuthDto,
  ) {
    if (dto.full_name == '' || dto.id == '') {
      // Service validation error
      throw new Error("Los datos están incompletos");
    }
    return await this.repo.create(dto.id, dto.full_name);
  }
  getProfile(user_id:string){
    if(!isUUID(user_id)){
      throw new Error("usuario no existente");
    }
    return this.repo.findByID(user_id);
  }

  getInfo(user_id:string){
    if(!isUUID(user_id)){
      throw new Error("usuario no existente");
    }
    return this.repo.getInfoUserByID(user_id);
  }

  getAccountByUserId(userId: string) {
    if (!isUUID(userId)) {
      throw new Error("ID de usuario inválido");
    }
    return this.repo.getAccountByUserId(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (!isUUID(userId)) {
      throw new Error("ID de usuario inválido");
    }

    const fullName = dto.full_name.trim();

    // Validar que no esté vacío
    if (!fullName) {
      throw new Error("El nombre no puede estar vacío");
    }

    // No puede comenzar con número
    if (/^\d/.test(fullName)) {
      throw new Error("El nombre no puede comenzar con un número");
    }

    // No puede terminar con espacio
    if (/\s$/.test(fullName)) {
      throw new Error("El nombre no puede terminar con un espacio");
    }

    // No puede comenzar con espacio
    if (/^\s/.test(fullName)) {
      throw new Error("El nombre no puede comenzar con un espacio");
    }

    // Solo permite letras (con acentos), números (no al inicio) y espacios
    if (!/^[A-Za-zÀ-ÿ]([A-Za-zÀ-ÿ0-9\s]*[A-Za-zÀ-ÿ0-9])?$/.test(fullName)) {
      throw new Error("El nombre contiene caracteres no permitidos");
    }

    // Debe contener al menos una letra
    if (!/[A-Za-zÀ-ÿ]/.test(fullName)) {
      throw new Error("El nombre debe contener al menos una letra");
    }

    return await this.repo.updateProfile(userId, fullName);
  }

}
