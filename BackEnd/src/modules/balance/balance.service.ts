import { Account } from "../../domain/entities/Account";
import { BalanceRepository, MonthlyTrendItem, WeeklyTrendItem } from "./balance.repository";

export interface BalanceCalculationResult {
  accountId: string;
  budget: number;
  totalExpenses: number;
  remaining: number;
  daysRemaining: number;
  dailyAvailable: number;
  weeklySaving: number;
  weekStart: string;
  weekEnd: string;
}

export class BalanceService {
  constructor(private readonly repo = new BalanceRepository()) {}

  async getMonthlyTrend(accountId: string, months: number = 6): Promise<MonthlyTrendItem[]> {
    return this.repo.getMonthlyTrend(accountId, months);
  }

  async getWeeklyTrend(accountId: string, weeks: number = 6): Promise<WeeklyTrendItem[]> {
    return this.repo.getWeeklyTrend(accountId, weeks);
  }

  async calculateUserBalance(
    accountId: string,
  ): Promise<BalanceCalculationResult | null> {
    const weeklyIncome = await this.repo.getWeeklyIncome(accountId);

    if (weeklyIncome === 0) {
      console.log(
        `No weekly income found for account ${accountId}, skipping...`,
      );
      return null;
    }

    const budget = weeklyIncome;
    const expenses = await this.repo.getWeeklyExpenses(accountId);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget - totalExpenses;
    const daysRemaining = await this.repo.getDaysRemainingInWeek();
    const dailyAvailable = daysRemaining > 0 ? remaining / daysRemaining : 0;
    const weeklySaving = remaining > 0 ? remaining : 0;

    const weekRange = this.repo.getWeekRangeForInsert();

    return {
      accountId,
      budget,
      totalExpenses,
      remaining,
      daysRemaining,
      dailyAvailable,
      weeklySaving,
      weekStart: weekRange.weekStart,
      weekEnd: weekRange.weekEnd,
    };
  }

  async processAllUsers(): Promise<void> {
    console.log("[BalanceService] Starting weekly balance calculation...");
    const accounts = await this.repo.getAllAccounts();
    console.log(
      `[BalanceService] Found ${accounts.length} accounts to process`,
    );

    for (const account of accounts) {
      try {
        const result = await this.calculateUserBalance(account.id);

        if (result) {
          console.log(`[BalanceService] Account ${account.id}:`, {
            budget: result.budget,
            totalExpenses: result.totalExpenses,
            remaining: result.remaining,
            daysRemaining: result.daysRemaining,
            dailyAvailable: result.dailyAvailable.toFixed(2),
            weeklySaving: result.weeklySaving,
          });

          if (result.weeklySaving > 0) {
            await this.repo.insertSaving(
              account.id,
              result.weeklySaving,
              result.weekStart,
            );
            console.log(
              `[BalanceService] Inserted saving of ${result.weeklySaving} for account ${account.id}`,
            );
          } else {
            console.log(
              `[BalanceService] No saving to insert for account ${account.id} (remaining: ${result.remaining})`,
            );
          }
        }
      } catch (error) {
        console.error(
          `[BalanceService] Error processing account ${account.id}:`,
          error,
        );
      }
    }

    console.log("[BalanceService] Weekly balance calculation completed");
  }
}
