import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";
import { CreateSavingDto } from "./dto/create-savings.dto";
import { CreateWeeklyGoalDto } from "./dto/create-weekly-goal.dto";

export interface SavingHistoryResponse {
  id: string;
  amount: number;
  created_at: string;
  week_start: string;
}

export interface WeeklyGoalResponse {
  id: string;
  account_id: string;
  target_amount: number;
  current_amount: number;
  week_start: string;
  week_end: string;
  status: string;
  created_at: string;
}

export class SavingsRespository extends SupabaseDataSource {
  async create(data: CreateSavingDto) {
    if (data == null)
      throw new Error("Error la informacion no esta completada");
  }

  async createWeeklyGoal(data: CreateWeeklyGoalDto) {
    if (!data.account_id || !data.target_amount || !data.week_start || !data.week_end) {
      throw new Error("Error la informacion no esta completada");
    }

    const { data: result, error } = await this.client
      .from("weekly_goals")
      .insert({
        account_id: data.account_id,
        target_amount: data.target_amount,
        week_start: data.week_start,
        week_end: data.week_end,
        status: "active",
        current_amount: 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Error al crear la meta semanal");
    }

    return result;
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
    return (data || []) as SavingHistoryResponse[];
  }

  async findActiveWeeklyGoal(account_id: string, week_start: string, week_end: string): Promise<WeeklyGoalResponse | null> {
    const { data, error } = await this.client
      .from("weekly_goals")
      .select("*")
      .eq("account_id", account_id)
      .eq("status", "active")
      .gte("week_start", week_start)
      .lte("week_end", week_end)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error("Error al buscar meta semanal activa");
    }

    return data as WeeklyGoalResponse | null;
  }

  async addSavingsMovement(account_id: string, amount: number, week_start: string, week_end: string, is_automatic: boolean = false) {
    const { data, error } = await this.client
      .from("savings_movements")
      .insert({
        account_id,
        amount,
        week_start,
        week_end,
        is_automatic,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Error al registrar el ahorro");
    }

    return data;
  }

  async findWeeklyGoalsByAccount(account_id: string): Promise<WeeklyGoalResponse[]> {
    if (!account_id) throw new Error("Error la cuenta no es correcta");
    
    const { data, error } = await this.client
      .from("weekly_goals")
      .select("*")
      .eq("account_id", account_id)
      .order("week_start", { ascending: false });

    if (error) {
      throw new Error("Error al obtener las metas semanales");
    }

    return (data || []) as WeeklyGoalResponse[];
  }

  async getTotalIncomeForWeek(account_id: string, week_start: string, week_end: string): Promise<number> {
    const { data, error } = await this.client
      .from("income_history")
      .select("amount")
      .eq("account_id", account_id)
      .gte("created_at", week_start)
      .lte("created_at", week_end);

    if (error) {
      return 0;
    }

    return (data || []).reduce((sum: number, item: { amount: number }) => sum + (item.amount || 0), 0);
  }

  async getTotalExpensesForWeek(account_id: string, week_start: string, week_end: string): Promise<number> {
    const { data, error } = await this.client
      .from("expense_history")
      .select("amount")
      .eq("account_id", account_id)
      .gte("created_at", week_start)
      .lte("created_at", week_end);

    if (error) {
      return 0;
    }

    return (data || []).reduce((sum: number, item: { amount: number }) => sum + (item.amount || 0), 0);
  }

  async updateWeeklyGoalStatus(goalId: string, status: string) {
    const { error } = await this.client
      .from("weekly_goals")
      .update({ status })
      .eq("id", goalId);

    if (error) {
      throw new Error("Error al actualizar el estado de la meta");
    }
  }

  async updateWeeklyGoalCurrentAmount(goalId: string, currentAmount: number) {
    const { error } = await this.client
      .from("weekly_goals")
      .update({ current_amount: currentAmount })
      .eq("id", goalId);

    if (error) {
      throw new Error("Error al actualizar el monto de la meta");
    }
  }

  async findWeeklyGoalByDateRange(account_id: string, week_start: string, week_end: string): Promise<WeeklyGoalResponse | null> {
    const { data, error } = await this.client
      .from("weekly_goals")
      .select("*")
      .eq("account_id", account_id)
      .gte("week_start", week_start)
      .lte("week_end", week_end)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error("Error al buscar meta semanal");
    }

    return data as WeeklyGoalResponse | null;
  }
}
