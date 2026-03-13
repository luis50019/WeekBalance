import { Account } from "../../domain/entities/Account";
import { ExpenseHistory } from "../../domain/entities/ExpenseHistory";
import { IncomeHistory } from "../../domain/entities/IncomeHistory";
import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";

export class BalanceRepository extends SupabaseDataSource {
  async getAllAccounts(): Promise<Account[]> {
    const { data, error } = await this.client
      .from("accounts")
      .select("id, user_id, balance");

    if (error) {
      throw new Error(`Error fetching accounts: ${error.message}`);
    }

    return data || [];
  }

  async getWeeklyIncome(accountId: string): Promise<number> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    console.log(accountId);
    const { data, error } = await this.client
      .from("income_history")
      .select("amount")
      .eq("account_id", accountId)
      .gte("created_at", startOfWeek.toISOString());

    if (error) {
      throw new Error(`Error fetching weekly income: ${error.message}`);
    }
    console.log(data);

    const incomeHistory = (data || []) as IncomeHistory[];
    return incomeHistory.reduce((sum, inc) => sum + inc.amount, 0);
  }

  async getWeeklyExpenses(accountId: string): Promise<ExpenseHistory[]> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { data, error } = await this.client
      .from("expense_history")
      .select("id, account_id, category, amount, description, created_at")
      .eq("account_id", accountId)
      .gte("created_at", startOfWeek.toISOString());

    if (error) {
      throw new Error(`Error fetching weekly expenses: ${error.message}`);
    }

    return (data || []) as ExpenseHistory[];
  }

  async getDaysRemainingInWeek(): Promise<number> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysRemaining = 6 - dayOfWeek;
    return daysRemaining > 0 ? daysRemaining : 0;
  }

  async insertSaving(
    accountId: string,
    amount: number,
    weekStart: string,
  ): Promise<void> {
    const { error } = await this.client.from("savings_movements").insert({
      account_id: accountId,
      amount,
      week_start: weekStart,
    });

    if (error) {
      throw new Error(`Error inserting saving: ${error.message}`);
    }
  }

  private getWeekRange(): { weekStart: string; weekEnd: string } {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToSunday = dayOfWeek;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diffToSunday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
    };
  }

  getWeekRangeForInsert(): { weekStart: string; weekEnd: string } {
    return this.getWeekRange();
  }
}
