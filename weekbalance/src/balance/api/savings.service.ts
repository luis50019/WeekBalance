import { savingsRepository, weeklyGoalsRepository, incomeRepository, expenseRepository, CreateSavingsDTO, CreateWeeklyGoalDTO } from "../../core/database";
import { useAuthStore } from "../../auth/store";

export const getSavingHistoryService = async (accountId: string) => {
  return await savingsRepository.getByAccountId(accountId);
};

export const createSavingService = async (
  amount: number,
  description: string
) => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const dto: CreateSavingsDTO = {
    account_id: account.id,
    amount,
    description,
  };

  return await savingsRepository.create(dto);
};

export const createWeeklyGoalService = async (
  targetAmount: number,
  weekStart: string,
  weekEnd: string
) => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const dto: CreateWeeklyGoalDTO = {
    account_id: account.id,
    amount: targetAmount,
    category: "ahorro",
    week_start: weekStart,
    week_end: weekEnd,
  };

  return await weeklyGoalsRepository.create(dto);
};

export const registerSavingService = async (
  amount: number,
  description?: string
) => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const dto: CreateSavingsDTO = {
    account_id: account.id,
    amount,
    description,
  };

  return await savingsRepository.create(dto);
};

export const getWeeklyGoalsService = async (accountId: string) => {
  return await weeklyGoalsRepository.getByAccountId(accountId);
};

function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToSunday = dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToSunday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { weekStart, weekEnd };
}

function isWeekCompleted(weekEndDate: string): boolean {
  const now = new Date();
  const weekEnd = new Date(weekEndDate + "T23:59:59.999");
  return now > weekEnd;
}

function getWeekStatus(weekStart: string, weekEnd: string): "active" | "completed" | "future" {
  const now = new Date();
  const weekStartDate = new Date(weekStart + "T00:00:00.000");
  const weekEndDate = new Date(weekEnd + "T23:59:59.999");

  if (now < weekStartDate) {
    return "future";
  }
  if (now > weekEndDate) {
    return "completed";
  }
  return "active";
}

function filterByDateRange<T extends { created_at: string }>(
  items: T[],
  startDate: Date,
  endDate: Date
): T[] {
  return items.filter((item) => {
    const itemDate = new Date(item.created_at);
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const itemTime = itemDate.getTime();
    return itemTime >= startTime && itemTime <= endTime;
  });
}

export const getCurrentWeekGoalsService = async () => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const { weekStart, weekEnd } = getCurrentWeekDates();
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  console.log("[WeeklyGoals] Week range:", weekStartStr, "to", weekEndStr);

  const goals = await weeklyGoalsRepository.getCurrentWeekGoals(
    account.id,
    weekStartStr,
    weekEndStr
  );

  const incomes = await incomeRepository.getByAccountId(account.id);
  const expenses = await expenseRepository.getByAccountId(account.id);

  console.log("[WeeklyGoals] Total incomes:", incomes.length);
  console.log("[WeeklyGoals] Total expenses:", expenses.length);

  const weekIncomes = filterByDateRange(incomes, weekStart, weekEnd);
  const weekExpenses = filterByDateRange(expenses, weekStart, weekEnd);

  console.log("[WeeklyGoals] Week incomes:", weekIncomes.length, weekIncomes.reduce((s, i) => s + i.amount, 0));
  console.log("[WeeklyGoals] Week expenses:", weekExpenses.length, weekExpenses.reduce((s, e) => s + e.amount, 0));

  const totalWeekIncomes = weekIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalWeekExpenses = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const weeklySaving = totalWeekIncomes - totalWeekExpenses;

  console.log("[WeeklyGoals] Weekly saving:", weeklySaving);

  const goalsWithProgress = await Promise.all(
    goals.map(async (goal) => {
      const weekStatus = getWeekStatus(goal.week_start, goal.week_end);
      const isWeekFinished = isWeekCompleted(goal.week_end);
      
      const isCompleted = weeklySaving >= goal.amount;
      const progress = goal.amount > 0 
        ? Math.min((weeklySaving / goal.amount) * 100, 100)
        : 0;
      const remaining = Math.max(goal.amount - weeklySaving, 0);

      return {
        ...goal,
        weekIncomes: totalWeekIncomes,
        weekExpenses: totalWeekExpenses,
        weeklySaving: Math.max(weeklySaving, 0),
        weekSavings: 0,
        progress,
        remaining,
        isCompleted,
        isWeekFinished,
        weekStatus,
      };
    })
  );

  const totalGoalAmount = goals.reduce((sum, g) => sum + g.amount, 0);
  const totalSaved = Math.max(weeklySaving, 0);
  const totalProgress = totalGoalAmount > 0 
    ? Math.min((totalSaved / totalGoalAmount) * 100, 100) 
    : 0;

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    weekIncomes: totalWeekIncomes,
    weekExpenses: totalWeekExpenses,
    weeklySaving: Math.max(weeklySaving, 0),
    weekSavings: 0,
    goals: goalsWithProgress,
    totalGoalAmount,
    totalSaved,
    totalProgress,
  };
};

export const deleteWeeklyGoalService = async (goalId: string) => {
  return await weeklyGoalsRepository.delete(goalId);
};
