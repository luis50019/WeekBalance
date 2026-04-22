import { AuthRepository } from "./auth.repository";
import { CreateAuthDto } from "./dto/create-auth.dto";
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
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Usuario no encontrado");
    }

    // Obtener perfil y cuenta del usuario
    const profile = await this.repo.findByID(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      profile,
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
      console.log('error en el servicio');
      throw new Error("Los datos estan incompletos");
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

}
