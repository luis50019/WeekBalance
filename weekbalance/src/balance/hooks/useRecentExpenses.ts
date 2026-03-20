import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../../auth/store";
import { getHistory } from "../api/expenses.service";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";

export const useRecentExpenses = (limit: number = 5) => {
  const { profile, session } = useAuthStore();
  const [data, setData] = useState<ResponseIncomeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentExpenses = useCallback(async () => {
    if (!profile?.account_id || !session?.access_token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const history = await getHistory(profile.account_id, session.access_token);
      
      const sortedHistory = [...history].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setData(sortedHistory.slice(0, limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los gastos");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.account_id, session?.access_token, limit]);

  useEffect(() => {
    fetchRecentExpenses();
  }, [fetchRecentExpenses]);

  return { data, loading, error, refetch: fetchRecentExpenses };
};
