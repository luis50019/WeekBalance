import { incomeRepository, CreateIncomeDTO, IncomeRecord } from "../../core/database";
import { CreateFunds } from "../types/Request/CreateFunds";
import { useAuthStore } from "../../auth/store";
import { ResponseIncomeDto } from "../types/Response/ResponseIncomeDto";

export const register = async (newFunds: CreateFunds) => {
  const { account } = useAuthStore.getState();
  if (!account) {
    throw new Error("No hay sesión activa");
  }

  const dto: CreateIncomeDTO = {
    account_id: account.id,
    amount: parseFloat(newFunds.amount),
    category: newFunds.category,
    description: newFunds.description,
    source: newFunds.source ? String(newFunds.source) : undefined,
  };

  return await incomeRepository.create(dto);
};

export const getHistory = async (accountId: string): Promise<ResponseIncomeDto[]> => {
  const incomes = await incomeRepository.getByAccountId(accountId);
  return incomes.map((income: IncomeRecord) => ({
    id: income.id,
    account_id: income.account_id,
    amount: income.amount,
    category: income.category,
    description: income.description,
    source: income.source,
    created_at: income.created_at,
  }));
};
