import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { CreateSavingDto } from "./dto/create-savings.dto";

export interface SavingHistoryResponse {
  id: string;
  amount: number;
  created_at: string;
  week_start: string;
}

export class SavingsRespository extends SupabaseDataSource {
  async create(data: CreateSavingDto) {
    if (data == null)
      throw new Error("Error la informacion no esta completada");
  }

  async findByAccountSavinigHistory(
    account_id: string,
  ): Promise<SavingHistoryResponse[]> {
    if (account_id == "") throw new Error("Error la cuenta no es correcta");
    const { data, error } = await this.client
      .from("savings_movements")
      .select("id, amount,created_at,week_start")
      .eq("account_id", account_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error("No se logro obtener el historial");
    console.log(data);
    return (data || []) as SavingHistoryResponse[];
  }
}
