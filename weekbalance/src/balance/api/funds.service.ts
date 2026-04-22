import { apiClient } from "../../core/api/client";
import { CreateFunds } from "../types/Request/CreateFunds";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";

interface CreateIncomeRequest {
  account_id: string;
  amount: number;
  category: string;
  description: string;
  source?: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const register = async (newFunds: CreateFunds): Promise<void> => {
  const dto: CreateIncomeRequest = {
    account_id: newFunds.account_id,
    amount: parseFloat(newFunds.amount),
    category: newFunds.category,
    description: newFunds.description,
    source: newFunds.source ? String(newFunds.source) : undefined,
  };

  await apiClient.post("/incomes/add/", dto);
};

export const getHistory = async (accountId: string): Promise<ResponseIncomeDto[]> => {
  const response = await apiClient.get<ApiResponse<ResponseIncomeDto[]>>(
    `/incomes/history/${accountId}`
  );
  return response.data.data;
};

export const getWeeklyTotal = async (accountId: string): Promise<number> => {
  const response = await apiClient.get<ApiResponse<{ total: number }>>(
    `/incomes/weekly-total/${accountId}`
  );
  return response.data.data.total;
};

interface UpdateIncomeRequest {
  id: string;
  account_id: string;
  amount?: number;
  category?: string;
  description?: string;
  source?: string;
}

export const updateIncome = async (data: UpdateIncomeRequest): Promise<void> => {
  await apiClient.put("/incomes/update/", data);
};

export const getIncomeById = async (id: string): Promise<ResponseIncomeDto> => {
  const response = await apiClient.get<ApiResponse<ResponseIncomeDto>>(
    `/incomes/${id}`
  );
  return response.data.data;
};