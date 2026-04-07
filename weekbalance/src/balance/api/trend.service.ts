import { expenseRepository, IncomeRecord, ExpenseRecord } from "../../core/database";
import { useAuthStore } from "../../auth/store";

export interface WeeklyTrendData {
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

export interface DailyTrendData {
  dayName: string;
  dayIndex: number;
  expenses: number;
}

export const getWeeklyTrend = async (): Promise<WeeklyTrendData[]> => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const expenses = await expenseRepository.getByAccountId(account.id);

  const dailyExpenses: Map<number, number> = new Map();
  for (let i = 0; i < 7; i++) {
    dailyExpenses.set(i, 0);
  }

  expenses.forEach((exp: ExpenseRecord) => {
    const date = new Date(exp.created_at);
    const dayOfWeek = date.getDay();
    const current = dailyExpenses.get(dayOfWeek) || 0;
    dailyExpenses.set(dayOfWeek, current + exp.amount);
  });

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const weeklyTrends: WeeklyTrendData[] = [];

  const now = new Date();
  const currentDayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDayOfWeek);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekStartStr = startOfWeek.toISOString().split("T")[0];
  const weekEndStr = endOfWeek.toISOString().split("T")[0];

  dailyExpenses.forEach((amount, dayIndex) => {
    weeklyTrends.push({
      week: dayNames[dayIndex],
      weekNumber: dayIndex,
      startDate: weekStartStr,
      endDate: weekEndStr,
      dateRangeLabel: `${weekStartStr} - ${weekEndStr}`,
      isCurrentWeek: dayIndex === currentDayOfWeek,
      income: 0,
      expenses: amount,
      balance: amount,
    });
  });

  return weeklyTrends;
};
