import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { ExpenseRow } from "../../infrastructure/database/types/expense.row";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ResponseAuthDto } from "./dto/response-auth.dto";


export class AuthRepository extends SupabaseDataSource {
  async create(data: CreateAuthDto) {
    const { error } = await this.client.from("profiles").insert(data);
    if (error) throw new Error(error.message);
  }

  async findByID(id: string): Promise<ResponseAuthDto> {
    const { data, error } = await this.client
      .from("profiles")
      .select("id, full_name, avatar_url, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) {
      throw new Error("Perfil no encontrado");
    }

    return data as ResponseAuthDto
  }
}
