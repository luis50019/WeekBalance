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

  async getExpensesByCategory(accountId: string) {
    const { data, error } = await this.client.rpc(
      "get_expense_percentage_by_category",
      {
        p_account_id: accountId,
      }
    );

    if (error) throw new Error(error.message);
    return data;
  }

  async getWeeklyTotal(accountId: string, weekStart: string, weekEnd: string) {
    const { data, error } = await this.client
      .from("expense_history")
      .select("amount")
      .eq("account_id", accountId)
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd);

    if (error) {
      throw new Error("Error al obtener gastos semanales");
    }

    const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
    return total;
  }
}
