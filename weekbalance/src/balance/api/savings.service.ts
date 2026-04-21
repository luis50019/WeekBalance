import { apiClient } from "../../core/api/client";

interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface WeeklyGoalResponse {
  id: string;
  account_id: string;
  target_amount: number;
  week_start: string;
  week_end: string;
  status: "active" | "completed" | "failed";
  created_at: string;
}

export const getSavingHistoryService = async (accountId: string) => {
  const response = await apiClient.get<ApiResponse<any[]>>(
    `/saving/history/${accountId}`
  );
  return response.data.data;
};

export const createSavingService = async (
  accountId: string,
  amount: number,
  description: string
) => {
  await apiClient.post("/saving/add/", {
    account_id: accountId,
    amount,
    description,
  });
};

export const createWeeklyGoalService = async (
  accountId: string,
  targetAmount: number,
  weekStart: string,
  weekEnd: string
) => {
  const response = await apiClient.post<ApiResponse<WeeklyGoalResponse>>(
    "/saving/weekly-goal",
    {
      account_id: accountId,
      target_amount: targetAmount,
      week_start: weekStart,
      week_end: weekEnd,
    }
  );
  return response.data.data;
};

export const registerSavingService = async (
  accountId: string,
  amount: number,
  weekStart: string,
  weekEnd: string
) => {
  const response = await apiClient.post<ApiResponse<any>>("/saving/register", {
    account_id: accountId,
    amount,
    week_start: weekStart,
    week_end: weekEnd,
  });
  return response.data.data;
};

export const getWeeklyGoalsService = async (accountId: string) => {
  const response = await apiClient.get<ApiResponse<WeeklyGoalResponse[]>>(
    "/saving/weekly-goals",
    { params: { accountId } }
  );
  return response.data.data;
};

export const getCurrentWeekGoalsService = async (accountId: string) => {
  const goals = await getWeeklyGoalsService(accountId);
  return goals;
};

export const deleteWeeklyGoalService = async (goalId: string) => {
  console.log("Delete goal not implemented in backend");
};

// Helper para obtener fechas de la semana actual
export const getCurrentWeekDates = (): { weekStart: string; weekEnd: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToSunday = dayOfWeek;

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToSunday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return {
    weekStart: weekStart.toISOString().split("T")[0],
    weekEnd: weekEnd.toISOString().split("T")[0],
  };
};