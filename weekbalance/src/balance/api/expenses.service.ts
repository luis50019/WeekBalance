import { apiClient } from "../../core/api/client";
import { CreateExpense } from "../types/Request/CreateExpense";

interface CreateExpenseRequest {
  account_id: string;
  amount: number;
  category: string;
  description?: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ExpenseByCategory {
  category: string;
  description: string;
  total_spent: number;
  percentage: number;
}

export const register = async (newExpense: CreateExpense): Promise<void> => {
  const dto: CreateExpenseRequest = {
    account_id: newExpense.account_id,
    amount: newExpense.amount,
    category: newExpense.category,
    description: newExpense.description,
  };

  await apiClient.post("/expenses/register/", dto);
};

export const getHistory = async (accountId: string) => {
  const response = await apiClient.get<ApiResponse<any[]>>(
    `/expenses/history/${accountId}`
  );
  return response.data.data;
};

export const getRecent = async (accountId: string, limit: number = 5) => {
  const history = await getHistory(accountId);
  return history.slice(0, limit);
};

export const getByCategory = async (accountId: string): Promise<ExpenseByCategory[]> => {
  const response = await apiClient.get<ApiResponse<ExpenseByCategory[]>>(
    `/expenses/by-category/${accountId}`
  );
  return response.data.data;
};

export const getWeeklyTotal = async (accountId: string): Promise<number> => {
  const response = await apiClient.get<ApiResponse<{ total: number }>>(
    `/expenses/weekly-total/${accountId}`
  );
  return response.data.data.total;
};