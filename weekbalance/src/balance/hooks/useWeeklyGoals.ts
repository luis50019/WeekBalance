import { useState, useEffect, useCallback, useContext } from "react";
import { useAuthStore } from "../../auth/store";
import {
  getWeeklyGoalsService,
  createWeeklyGoalService,
  getCurrentWeekDates,
} from "../api/savings.service";
import { getWeeklyTotal as getIncomesWeeklyTotal } from "../api/funds.service";
import { getWeeklyTotal as getExpensesWeeklyTotal } from "../api/expenses.service";
import { BalanceContext } from "../../core/context/BalanceProvider";

export interface WeeklyGoalWithProgress {
  id: string;
  account_id: string;
  target_amount: number;
  week_start: string;
  week_end: string;
  created_at: string;
  weekIncomes: number;
  weekExpenses: number;
  weeklySaving: number;
  progress: number;
  remaining: number;
  isCompleted: boolean;
  isWeekFinished: boolean;
  weekStatus: "active" | "completed" | "future";
}

export const useWeeklyGoals = () => {
  const { account } = useAuthStore();
  const { setChangeValue: triggerBalanceChange } = useContext(BalanceContext);
  const [data, setData] = useState<{
    weekStart: string;
    weekEnd: string;
    weekIncomes: number;
    weekExpenses: number;
    weeklySaving: number;
    goals: WeeklyGoalWithProgress[];
    totalGoalAmount: number;
    totalSaved: number;
    totalProgress: number;
  } | null>(null);
  const [history, setHistory] = useState<WeeklyGoalWithProgress[]>([]);
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

      const { weekStart, weekEnd } = getCurrentWeekDates();

      // Obtener ingresos y gastos semanales
      const weeklyIncomes = await getIncomesWeeklyTotal(account.id);
      const weeklyExpenses = await getExpensesWeeklyTotal(account.id);
      const weeklySaving = weeklyIncomes - weeklyExpenses;

      // Obtener metas semanales del backend
      const goalsFromBackend = await getWeeklyGoalsService(account.id);

      const goalsWithProgress: WeeklyGoalWithProgress[] = (goalsFromBackend || []).map((goal) => {
        const isCurrentWeek =
          goal.week_start === weekStart && goal.week_end === weekEnd;
        const isWeekFinished = new Date(goal.week_end + "T23:59:59.999") < new Date();

        const progress = goal.target_amount > 0
          ? Math.min((weeklySaving / goal.target_amount) * 100, 100)
          : 0;

        return {
          id: goal.id,
          account_id: goal.account_id,
          target_amount: goal.target_amount,
          week_start: goal.week_start,
          week_end: goal.week_end,
          created_at: goal.created_at,
          weekIncomes: weeklyIncomes,
          weekExpenses: weeklyExpenses,
          weeklySaving,
          progress,
          remaining: Math.max(goal.target_amount - weeklySaving, 0),
          isCompleted: weeklySaving >= goal.target_amount,
          isWeekFinished,
          weekStatus: isWeekFinished ? ("completed" as const) : ("active" as const),
        };
      });

      // Meta actual (si existe para esta semana)
      const currentGoal = goalsWithProgress.find(
        (g) => g.week_start === weekStart && g.week_end === weekEnd
      );

      const totalGoalAmount = currentGoal?.target_amount || 0;
      const totalSaved = weeklySaving;
      const totalProgress = totalGoalAmount > 0
        ? Math.min((totalSaved / totalGoalAmount) * 100, 100)
        : 0;

      setData({
        weekStart,
        weekEnd,
        weekIncomes: weeklyIncomes,
        weekExpenses: weeklyExpenses,
        weeklySaving,
        goals: currentGoal ? [currentGoal] : [],
        totalGoalAmount,
        totalSaved,
        totalProgress,
      });

      // Historial: semanas pasadas
      const historyGoals = goalsWithProgress
        .filter((g) => g.isWeekFinished)
        .sort(
          (a, b) =>
            new Date(b.week_start).getTime() - new Date(a.week_start).getTime()
        );
      setHistory(historyGoals);
    } catch (err) {
      console.error("[useWeeklyGoals] Error:", err);
      setError(err instanceof Error ? err.message : "Error al cargar las metas");
    } finally {
      setLoading(false);
    }
  }, [account?.id, refreshKey]);

  useEffect(() => {
    fetchWeeklyGoals();
  }, [fetchWeeklyGoals, refreshKey]);

  const createGoal = async (amount: number): Promise<void> => {
    if (!account) {
      throw new Error("No hay sesión activa");
    }

    const { weekStart, weekEnd } = getCurrentWeekDates();

    await createWeeklyGoalService(account.id, amount, weekStart, weekEnd);
    await fetchWeeklyGoals();
    await triggerBalanceChange();
  };

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
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
    totalGoalAmount: data?.totalGoalAmount || 0,
    totalSaved: data?.totalSaved || 0,
    totalProgress: data?.totalProgress || 0,
  };
};