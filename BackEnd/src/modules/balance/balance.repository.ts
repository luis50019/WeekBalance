import { Account } from "../../domain/entities/Account";
import { ExpenseHistory } from "../../domain/entities/ExpenseHistory";
import { IncomeHistory } from "../../domain/entities/IncomeHistory";
import { SupabaseDataSource } from "../../infrastructure/database/supabase.datasource";

export interface MonthlyTrendItem {
  month: string;
  monthShort: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface WeeklyTrendItem {
  week: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
  isCurrentWeek: boolean;
  income: number;
  expenses: number;
  balance: number;
}

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
    const { data, error } = await this.client
      .from("income_history")
      .select("amount")
      .eq("account_id", accountId)
      .gte("created_at", startOfWeek.toISOString());

    if (error) {
      throw new Error(`Error fetching weekly income: ${error.message}`);
    }

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

  async getMonthlyTrend(accountId: string, months: number = 6): Promise<MonthlyTrendItem[]> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const [incomesResult, expensesResult] = await Promise.all([
      this.client
        .from("income_history")
        .select("amount, created_at")
        .eq("account_id", accountId)
        .gte("created_at", startDate.toISOString()),
      this.client
        .from("expense_history")
        .select("amount, created_at")
        .eq("account_id", accountId)
        .gte("created_at", startDate.toISOString()),
    ]);

    if (incomesResult.error || expensesResult.error) {
      throw new Error("Error fetching monthly trend");
    }

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const monthNamesShort = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    for (let i = 0; i < months; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    (incomesResult.data || []).forEach((item) => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].income += item.amount;
      }
    });

    (expensesResult.data || []).forEach((item) => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].expenses += item.amount;
      }
    });

    const result: MonthlyTrendItem[] = [];
    const sortedKeys = Object.keys(monthlyData).sort();

    sortedKeys.forEach((key) => {
      const [year, month] = key.split("-");
      const monthIndex = parseInt(month, 10) - 1;
      result.push({
        month: monthNames[monthIndex],
        monthShort: monthNamesShort[monthIndex],
        income: monthlyData[key].income,
        expenses: monthlyData[key].expenses,
        balance: monthlyData[key].income - monthlyData[key].expenses,
      });
    });

    return result;
  }

  async getWeeklyTrend(accountId: string, weeks: number = 6): Promise<WeeklyTrendItem[]> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const currentWeekOfMonth = this.getWeekOfMonth(now);

    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    const [incomesResult, expensesResult] = await Promise.all([
      this.client
        .from("income_history")
        .select("amount, created_at")
        .eq("account_id", accountId)
        .gte("created_at", monthStart.toISOString())
        .lte("created_at", now.toISOString()),
      this.client
        .from("expense_history")
        .select("amount, created_at")
        .eq("account_id", accountId)
        .gte("created_at", monthStart.toISOString())
        .lte("created_at", now.toISOString()),
    ]);

    if (incomesResult.error || expensesResult.error) {
      throw new Error("Error fetching weekly trend");
    }

    const weeklyData: Record<number, { income: number; expenses: number; startDate: Date; endDate: Date }> = {};

    for (let weekNum = 1; weekNum <= currentWeekOfMonth; weekNum++) {
      const { start, end } = this.getWeekDatesOfMonth(currentYear, currentMonth, weekNum);
      weeklyData[weekNum] = { income: 0, expenses: 0, startDate: start, endDate: end };
    }

    (incomesResult.data || []).forEach((item) => {
      const date = new Date(item.created_at);
      const weekNum = this.getWeekOfMonth(date);
      if (weeklyData[weekNum]) {
        weeklyData[weekNum].income += item.amount;
      }
    });

    (expensesResult.data || []).forEach((item) => {
      const date = new Date(item.created_at);
      const weekNum = this.getWeekOfMonth(date);
      if (weeklyData[weekNum]) {
        weeklyData[weekNum].expenses += item.amount;
      }
    });

    const result: WeeklyTrendItem[] = [];
    const sortedKeys = Object.keys(weeklyData).map(Number).sort((a, b) => a - b);

    sortedKeys.forEach((weekNum) => {
      const { startDate, endDate } = weeklyData[weekNum];
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const yearStr = String(currentYear).slice(-2);
      result.push({
        week: `S${weekNum}`,
        weekNumber: weekNum,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dateRangeLabel: `S${weekNum}/${monthStr}/${yearStr}`,
        isCurrentWeek: weekNum === currentWeekOfMonth,
        income: weeklyData[weekNum].income,
        expenses: weeklyData[weekNum].expenses,
        balance: weeklyData[weekNum].income - weeklyData[weekNum].expenses,
      });
    });

    return result;
  }

  private getWeekOfMonth(date: Date): number {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const firstDayWeekday = firstDayOfMonth.getDay();
    return Math.ceil((dayOfMonth + firstDayWeekday) / 7);
  }

  private getWeekDatesOfMonth(year: number, month: number, weekNum: number): { start: Date; end: Date } {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();

    const startDay = (weekNum - 1) * 7 - firstDayWeekday + 1;
    let start = new Date(year, month, startDay);
    if (startDay < 1) {
      start = new Date(year, month, 1);
    }

    let end = new Date(year, month, startDay + 6);
    if (end > lastDayOfMonth) {
      end = lastDayOfMonth;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }
}
