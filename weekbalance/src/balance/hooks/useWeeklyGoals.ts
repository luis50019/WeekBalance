import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../auth/store";
import { getWeeklyGoalsService } from "../api/savings.service";

export interface WeeklyGoalData {
  id: string;
  account_id: string;
  target_amount: number;
  current_amount: number;
  week_start: string;
  week_end: string;
  status: string;
  created_at: string;
}

export const useWeeklyGoals = () => {
  const { profile, session } = useAuthStore();
  const [data, setData] = useState<WeeklyGoalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyGoals = useCallback(async () => {
    if (!profile?.account_id || !session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWeeklyGoalsService(
        profile.account_id,
        session.access_token
      );
      setData(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las metas");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.account_id, session?.access_token]);

  useEffect(() => {
    fetchWeeklyGoals();
  }, [fetchWeeklyGoals]);

  return { data, loading, error, refetch: fetchWeeklyGoals };
};
