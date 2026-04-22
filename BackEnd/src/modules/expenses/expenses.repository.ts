import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { ExpenseRow } from "../../infrastructure/database/types/expense.row";
import { ExpenseResponseDto } from "./dto/response-expensive.dto";
import { inserExpensive } from "./types/insert-expensive.type";
import { UpdateExpenseDto } from "./dto/update-expense.dto";


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
    return (data ?? []).map((item) => ({
      id: item.id,
      account_id: item.account_id,
      amount: Number(item.amount),
      category: item.category,
      description: item.description ?? item.descripcion ?? undefined,
      created_at: item.created_at,
    }));
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

  async getWeeklyByCategory(accountId: string, weekStart: string, weekEnd: string) {
    const { data, error } = await this.client
      .from("expense_history")
      .select("category, amount")
      .eq("account_id", accountId)
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd);

    if (error) {
      throw new Error("Error al obtener gastos por categoría");
    }

    // Agrupar por categoría
    const grouped: Record<string, number> = {};
    let total = 0;

    data.forEach((item) => {
      const amount = Number(item.amount);
      grouped[item.category] = (grouped[item.category] || 0) + amount;
      total += amount;
    });

    // Calcular porcentajes
    const result = Object.entries(grouped).map(([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      percentage: total > 0 ? Math.round((categoryTotal / total) * 10000) / 100 : 0,
    }));

    return { categories: result, total };
  }

  async getWeeklyByDay(accountId: string, weekStart: string, weekEnd: string) {
    const { data, error } = await this.client
      .from("expense_history")
      .select("amount, created_at")
      .eq("account_id", accountId)
      .gte("created_at", weekStart)
      .lte("created_at", weekEnd);

    if (error) {
      throw new Error("Error al obtener gastos diarios");
    }

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const dailyTotals: Record<string, number> = {
      Dom: 0, Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0
    };

    data.forEach((item) => {
      const date = new Date(item.created_at);
      const dayIndex = date.getDay(); 
      dailyTotals[dayNames[dayIndex]] += Number(item.amount);
    });

    const result = Object.entries(dailyTotals).map(([day, total]) => ({
      day,
      total,
    }));

    return result;
  }

  async getDailyTotal(accountId: string, startDate: string, endDate: string): Promise<{ total: number }> {
    const { data, error } = await this.client
      .from("expense_history")
      .select("amount")
      .eq("account_id", accountId)
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (error) {
      throw new Error("Error al obtener gastos del día");
    }

    const total = (data || []).reduce((sum, item) => sum + Number(item.amount), 0);
    return { total };
  }

  async update(data: UpdateExpenseDto): Promise<void> {
    if (!data.id) {
      throw new Error("El ID del gasto es requerido");
    }

    const updateData: Partial<inserExpensive> = {};
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.amount !== undefined) updateData.amount = data.amount;

    const { error } = await this.client
      .from("expense_history")
      .update(updateData)
      .eq("id", data.id)
      .eq("account_id", data.account_id);

    if (error) {
      throw new Error("Error al actualizar el gasto");
    }
  }

  async findById(id: string): Promise<ExpenseResponseDto | null> {
    const { data, error } = await this.client
      .from("expense_history")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error finding expense by ID:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      account_id: data.account_id,
      amount: Number(data.amount),
      category: data.category,
      description: data.description ?? data.descripcion ?? undefined,
      created_at: data.created_at,
    };
  }

  async adjustAccountBalance(accountId: string, delta: number): Promise<void> {
    const { data, error } = await this.client
      .from("accounts")
      .select("balance")
      .eq("id", accountId)
      .single();

    if (error || !data) {
      throw new Error("Error al obtener el saldo de la cuenta");
    }

    const currentBalance = Number(data.balance);
    const updatedBalance = Number((currentBalance + delta).toFixed(2));

    const { error: updateError } = await this.client
      .from("accounts")
      .update({ balance: updatedBalance })
      .eq("id", accountId);

    if (updateError) {
      throw new Error("Error al actualizar el saldo de la cuenta");
    }
  }
}
