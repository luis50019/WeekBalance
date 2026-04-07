import { useState, useEffect, useCallback } from "react";
import { getWeeklyTrend, WeeklyTrendData } from "../api/trend.service";

export const useWeeklyTrend = () => {
  const [data, setData] = useState<WeeklyTrendData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWeeklyTrend();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar la tendencia");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrend();
  }, [fetchTrend]);

  return { data, loading, error, refetch: fetchTrend };
};
