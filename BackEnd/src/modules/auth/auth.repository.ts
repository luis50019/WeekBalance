import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { ResponseAuthDto } from "./dto/response-auth.dto";
export class AuthRepository extends SupabaseDataSource {
  //?Registrar un nuevo usuario
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
  //Encontrar la informacion de perfil del usuario
  async findByID(id: string): Promise<ResponseAuthDto> {
    const { data, error } = await this.client
      .from("profiles")
      .select("id, full_name, avatar_url, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);

    const { data: accountData, error: errorAccount } = await this.client
      .from("accounts")
      .select("id")
      .eq("user_id", id)
      .maybeSingle();

    if (errorAccount) throw new Error(errorAccount.message);

    if (!data) throw new Error("Perfil no encontrado");

    return {
      account_id: accountData?.id,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
      full_name: data.full_name,
      id: data.id,
    };
  }

  async getInfoUserByID(userId: string) {
    const { data: incomes, error: incomeError } = await this.client.rpc(
      "get_recent_incomes",
      {
        p_account_id: userId,
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

    const { data: balance, error: balanceError } = await this.client
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
