import { useState, useEffect, useCallback, useContext } from "react";
import { useAuthStore } from "../../auth/store";
import {
  getCurrentWeekGoalsService,
  getWeeklyGoalsService,
  createWeeklyGoalService,
  deleteWeeklyGoalService,
} from "../api/savings.service";
import { BalanceContext } from "../../core/context/BalanceProvider";

export interface WeeklyGoalWithProgress {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  week_start: string;
  week_end: string;
  created_at: string;
  weekIncomes: number;
  weekExpenses: number;
  weeklySaving: number;
  weekSavings: number;
  progress: number;
  remaining: number;
  isCompleted: boolean;
  isWeekFinished: boolean;
  weekStatus: "active" | "completed" | "future";
}

interface CurrentWeekGoals {
  weekStart: string;
  weekEnd: string;
  weekIncomes: number;
  weekExpenses: number;
  weeklySaving: number;
  weekSavings: number;
  goals: WeeklyGoalWithProgress[];
  totalGoalAmount: number;
  totalSaved: number;
  totalProgress: number;
}

export interface HistoricalGoal {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  week_start: string;
  week_end: string;
  created_at: string;
  weekIncomes: number;
  weekExpenses: number;
  weeklySaving: number;
  progress: number;
  isCompleted: boolean;
  isWeekFinished: boolean;
  weekStatus: "active" | "completed" | "future";
}

export const useWeeklyGoals = () => {
  const { account } = useAuthStore();
  const { setChangeValue: triggerBalanceChange } = useContext(BalanceContext);
  const [data, setData] = useState<CurrentWeekGoals | null>(null);
  const [history, setHistory] = useState<HistoricalGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchWeeklyGoals = useCallback(async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getCurrentWeekGoalsService();
      setData(result);

      const allGoals = await getWeeklyGoalsService(account.id);
      const historyWithProgress = await Promise.all(
        allGoals.map(async (goal) => {
          const isWeekFinished = new Date(goal.week_end + "T23:59:59.999") < new Date();
          const weekStart = new Date(goal.week_start);
          const weekEnd = new Date(goal.week_end);
          
          const { incomeRepository, expenseRepository } = await import("../../core/database");
          const incomes = await incomeRepository.getByAccountId(account.id);
          const expenses = await expenseRepository.getByAccountId(account.id);
          
          const weekIncomesList = incomes.filter((inc) => {
            const incDate = new Date(inc.created_at);
            return incDate >= weekStart && incDate <= weekEnd;
          });
          const weekExpensesList = expenses.filter((exp) => {
            const expDate = new Date(exp.created_at);
            return expDate >= weekStart && expDate <= weekEnd;
          });
          
          const totalWeekIncomes = weekIncomesList.reduce((sum, i) => sum + i.amount, 0);
          const totalWeekExpenses = weekExpensesList.reduce((sum, e) => sum + e.amount, 0);
          const weeklySaving = totalWeekIncomes - totalWeekExpenses;
          
          const progress = goal.amount > 0 
            ? Math.min((weeklySaving / goal.amount) * 100, 100)
            : 0;
          
          return {
            ...goal,
            weekIncomes: totalWeekIncomes,
            weekExpenses: totalWeekExpenses,
            weeklySaving,
            progress,
            isCompleted: weeklySaving >= goal.amount,
            isWeekFinished,
            weekStatus: isWeekFinished ? "completed" : "active" as const,
          };
        })
      );
      
      const sortedHistory = historyWithProgress
        .filter(g => g.isWeekFinished)
        .sort((a, b) => new Date(b.week_start).getTime() - new Date(a.week_start).getTime());
      setHistory(sortedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las metas");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [account?.id]);

  useEffect(() => {
    fetchWeeklyGoals();
  }, [fetchWeeklyGoals, refreshKey]);

  const createGoal = async (amount: number): Promise<void> => {
    if (!data) {
      throw new Error("No hay datos de la semana");
    }

    await createWeeklyGoalService(
      amount,
      data.weekStart,
      data.weekEnd
    );
    await fetchWeeklyGoals();
  };

  const deleteGoal = async (goalId: string): Promise<void> => {
    await deleteWeeklyGoalService(goalId);
    await fetchWeeklyGoals();
  };

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    triggerBalanceChange();
  }, [triggerBalanceChange]);

  return {
    data,
    history,
    loading,
    error,
    refetch: fetchWeeklyGoals,
    refresh,
    createGoal,
    deleteGoal,
    totalGoalAmount: data?.totalGoalAmount || 0,
    totalSaved: data?.totalSaved || 0,
    totalProgress: data?.totalProgress || 0,
  };
};
