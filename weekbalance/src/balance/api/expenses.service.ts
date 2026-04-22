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

export interface ExpenseByCategoryWeekly {
  category: string;
  total: number;
  percentage: number;
}

export const getWeeklyByCategory = async (accountId: string): Promise<{
  categories: ExpenseByCategoryWeekly[];
  total: number;
}> => {
  const response = await apiClient.get<ApiResponse<{
    categories: ExpenseByCategoryWeekly[];
    total: number;
  }>>(`/expenses/weekly-by-category/${accountId}`);
  return response.data.data;
};

export interface ExpenseByDay {
  day: string;
  total: number;
}

export const getWeeklyByDay = async (accountId: string): Promise<ExpenseByDay[]> => {
  const response = await apiClient.get(`/expenses/weekly-by-day/${accountId}`);
  return response.data.data;
};

interface UpdateExpenseRequest {
  id: string;
  account_id: string;
  amount?: number;
  category?: string;
  description?: string;
}

export const updateExpense = async (data: UpdateExpenseRequest): Promise<void> => {
  await apiClient.put("/expenses/update/", data);
};

export const getExpenseById = async (id: string) => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      `/expenses/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching expense by ID:", error?.response?.data || error);
    throw error;
  }
};