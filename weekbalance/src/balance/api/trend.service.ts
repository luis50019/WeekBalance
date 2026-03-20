import { api } from "../../core/api/axios";

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

export const getWeeklyTrend = async (accountId: string, token: string) => {
  const response = await api.get(`/balance/weekly-trend`, {
    params: { accountId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
