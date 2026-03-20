import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../auth/store";
import { getWeeklyTrend, WeeklyTrendData } from "../api/trend.service";

export const useWeeklyTrend = () => {
  const { profile, session } = useAuthStore();
  const [data, setData] = useState<WeeklyTrendData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    if (!profile?.account_id || !session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWeeklyTrend(
        profile.account_id,
        session.access_token
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la tendencia");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [profile?.account_id, session?.access_token]);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { data, loading, error, refetch: fetchTrend };
};
