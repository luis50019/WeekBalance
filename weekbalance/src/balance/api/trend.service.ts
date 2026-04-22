import { apiClient } from "../../core/api/client";

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

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getWeeklyTrend = async (accountId: string): Promise<WeeklyTrendData[]> => {
  const response = await apiClient.get<ApiResponse<any[]>>(
    "/balance/weekly-trend",
    { params: { accountId } }
  );
  return response.data.data;
};

export const getMonthlyTrend = async (accountId: string, months: number = 6) => {
  const response = await apiClient.get<ApiResponse<any[]>>(
    "/balance/monthly-trend",
    { params: { accountId, months } }
  );
  return response.data.data;
};