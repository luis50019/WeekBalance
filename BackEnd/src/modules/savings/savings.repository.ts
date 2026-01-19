import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { Savings } from "./domain/savings";
import { CreateSavingDto } from "./dto/create-savings.dto";
import { ResponseSavingDto } from "./dto/response-savings.dto";


export class SavingsRespository extends SupabaseDataSource {
  async create(data: CreateSavingDto) {
    if (data == null)
      throw new Error("Error la informacion no esta completada");
  }

  async findByAccountSavinigHistory(account_id: string):Promise<ResponseSavingDto[]> {
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
