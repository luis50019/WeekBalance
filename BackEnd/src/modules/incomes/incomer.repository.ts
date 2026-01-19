import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { Income } from "./domain/income.entity";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { ResponseIncomeDto } from "./dto/response-income.dto";

export class IncomeRespository extends SupabaseDataSource {
  async create(data: CreateIncomeDto) {
    if (data == null)
      throw new Error("Error la informacion no esta completada");
  }

  async findByAccountIncomeHistory(account_id: string):Promise<ResponseIncomeDto[]> {
    if (account_id == "") throw new Error("Error la cuenta no es correcta");
    const { data, error } = await this.client
      .from("income_history")
      .select("*")
      .eq("account_id", account_id)
      .order("created_at", { ascending: false });
    if(error) throw new Error("No se logro obtener el historial");
    return data;
  }
}
