import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { ExpenseRow } from "../../infrastructure/database/types/expense.row";
import { ExpenseResponseDto } from "./dto/response-expensive.dto";
import { inserExpensive } from "./types/insert-expensive.type";


export class ExpensesRepository extends SupabaseDataSource {
  async create(data: inserExpensive) {
    const { error } = await this.client.from("expense_history").insert(data);
    if (error) throw new Error(error.message);
  }

  async findByAccount(account_id: string):Promise<ExpenseResponseDto[]> {
    const { data, error } = await this.client
      .from("expense_history")
      .select("*")
      .eq("account_id", account_id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
}
