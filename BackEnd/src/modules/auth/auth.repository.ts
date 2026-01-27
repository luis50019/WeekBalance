import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { ResponseAuthDto } from "./dto/response-auth.dto";
export class AuthRepository extends SupabaseDataSource {
  async create(userId: string, fullName: string) {
    const { data, error } = await this.client.rpc("create_user_profile", {
      p_user_id: userId,
      p_full_name: fullName,
    });

    if (error) {
      console.log("Error en el repositorio", error.message);
      throw new Error(error.message);
    }
    console.log("data", data);
    return data[0]; // { user_id, account_id }
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

    return data as ResponseAuthDto;
  }

  async getInfoUserByID(userId: string) {
    const { data: incomes, error: incomeError } = await this.client.rpc(
      "get_recent_incomes",
      {
        p_account_id: userId,
        p_limit: 10,
      },
    );

    if (incomeError) throw new Error(incomeError.message);

    const { data: expenses, error: expenseError } = await this.client.rpc(
      "get_expense_percentage_by_category",
      {
        p_account_id: userId,
      },
    );

    if (expenseError) throw new Error(expenseError.message);
    
    const { data: balance, error:balanceError } = await this.client
      .from("accounts")
      .select("balance")
      .eq("id", userId)
      .maybeSingle();

    if (balanceError) throw new Error(balanceError.message);
    console.log("balance", balance);

    return {
      balance: balance,
      recentIncomes: incomes,
      expensesByCategory: expenses,
    };
  }
}
