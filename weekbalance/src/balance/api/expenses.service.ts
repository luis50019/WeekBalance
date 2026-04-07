import { expenseRepository, CreateExpenseDTO } from "../../core/database";
import { CreateExpense } from "../types/Request/CreateExpense";
import { useAuthStore } from "../../auth/store";

export const register = async (newExpense: CreateExpense) => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const dto: CreateExpenseDTO = {
    account_id: account.id,
    amount: newExpense.amount,
    category: newExpense.category,
    description: newExpense.description,
  };

  return await expenseRepository.create(dto);
};

export const getHistory = async (accountId: string) => {
  return await expenseRepository.getByAccountId(accountId);
};

export const getRecent = async (accountId: string, limit: number = 5) => {
  return await expenseRepository.getRecentByAccountId(accountId, limit);
};

export const getByCategory = async (accountId: string) => {
  return await expenseRepository.getTotalByCategory(accountId);
};
