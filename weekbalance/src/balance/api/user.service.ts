import { useAuthStore } from "../../auth/store";
import { incomeRepository, expenseRepository } from "../../core/database";

export const getFinancialSummary = async () => {
  const { account, profile } = useAuthStore.getState();
  if (!account || !profile) {
    throw new Error("No hay sesión activa");
  }

  const allIncomes = await incomeRepository.getByAccountId(account.id);
  const allExpenses = await expenseRepository.getByAccountId(account.id);
  const expensesByCategory = await expenseRepository.getTotalByCategory(account.id);

  const totalIncome = allIncomes.reduce((sum: number, inc) => sum + inc.amount, 0);
  const totalExpense = allExpenses.reduce((sum: number, exp) => sum + exp.amount, 0);
  
  const calculatedBalance = totalIncome - totalExpense;

  const recentIncomes = allIncomes.slice(0, 5);
  const recentExpenses = allExpenses.slice(0, 5);

  console.log("[getFinancialSummary] Total incomes:", totalIncome);
  console.log("[getFinancialSummary] Total expenses:", totalExpense);
  console.log("[getFinancialSummary] Calculated balance:", calculatedBalance);

  const totalByCategory = expensesByCategory.map((item) => {
    const percentage = totalExpense > 0 ? (item.total / totalExpense) * 100 : 0;
    return {
      category: item.category,
      total_spent: item.total,
      percentage: Math.round(percentage * 100) / 100,
    };
  });

  return {
    balance: {
      balance: calculatedBalance,
    },
    totalIncome,
    totalExpense,
    recentIncomes: recentIncomes.map((inc) => ({
      id: inc.id,
      amount: inc.amount,
      description: inc.description,
      source: inc.source,
      created_at: inc.created_at,
    })),
    recentExpenses: recentExpenses.map((exp) => ({
      id: exp.id,
      account_id: exp.account_id,
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      created_at: exp.created_at,
    })),
    expensesByCategory: totalByCategory,
  };
};
