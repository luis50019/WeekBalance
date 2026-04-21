import { useAuthStore } from "../../auth/store";
import { apiClient } from "../../core/api/client";
import { getWeeklyTotal as getIncomesWeeklyTotal } from "./funds.service";
import { getWeeklyTotal as getExpensesWeeklyTotal, getByCategory } from "./expenses.service";

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getFinancialSummary = async () => {
  const { account, user } = useAuthStore.getState();
  if (!account || !user) {
    throw new Error("No hay sesión activa");
  }

  // Obtener balance de la cuenta
  const accountResponse = await apiClient.get<ApiResponse<any>>(`/auth/account/${user.id}`);
  const currentBalance = accountResponse.data.data.balance;

  // Obtener totales semanales
  const weeklyIncomes = await getIncomesWeeklyTotal(account.id);
  const weeklyExpenses = await getExpensesWeeklyTotal(account.id);

  // Obtener gastos por categoría
  const expensesByCategory = await getByCategory(account.id);

  // Obtener ingresos recientes (últimos 5)
  const incomesResponse = await apiClient.get<ApiResponse<any[]>>(
    `/incomes/history/${account.id}`
  );
  const recentIncomes = (incomesResponse.data.data || []).slice(0, 5);

  // Obtener gastos recientes (últimos 5)
  const expensesResponse = await apiClient.get<ApiResponse<any[]>>(
    `/expenses/history/${account.id}`
  );
  const recentExpenses = (expensesResponse.data.data || []).slice(0, 5);

  // Calcular balance real (ingresos - gastos de la base, no el saldo guardado)
  const balance = currentBalance;

  // Calcular totales por categoría
  const totalExpense = weeklyExpenses;
  const totalByCategory = (expensesByCategory || []).map((item: any) => ({
    category: item.category,
    total_spent: item.total_spent,
    percentage: item.percentage || 0,
  }));

  return {
    balance: {
      balance: balance,
    },
    totalIncome: weeklyIncomes,
    totalExpense: weeklyExpenses,
    recentIncomes: recentIncomes,
    recentExpenses: recentExpenses,
    expensesByCategory: totalByCategory,
  };
};