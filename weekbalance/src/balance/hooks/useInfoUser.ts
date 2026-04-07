import { useEffect, useState, useCallback } from "react";
import { FinancialSummaryDto } from "../types/Response/UserInfo.dto";
import { useAuthStore } from "../../auth/store";
import { getFinancialSummary } from "../api/user.service";
import { IExpensesAnalisys } from "../../core/interfaces/IExpensesAnlisys";
import { COLORSGRAPIC } from "../../core/constants/Color";

export const useInfoUser = () => {
  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummaryDto | null>(null);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [expenseAnalysis, setExpenseAnalysis] = useState<
    IExpensesAnalisys[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useAuthStore();

  const getDataFinancial = useCallback(async () => {
    if (!account) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getFinancialSummary();
      setFinancialSummary({
        balance: response.balance,
        recentIncomes: response.recentIncomes,
        expensesByCategory: response.expensesByCategory,
      });

      setTotalIncomes(response.totalIncome);
      setTotalExpenses(response.totalExpense);

      const expenseAnalysisData = (response.expensesByCategory || []).map(
        (expense) => {
          return {
            value: expense.percentage,
            color: COLORSGRAPIC[expense.category!] || "#888",
            text: expense.category,
          };
        },
      );

      setExpenseAnalysis(expenseAnalysisData);
    } catch (error) {
      console.log("[useInfoUser] Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [account?.id]);

  useEffect(() => {
    getDataFinancial();
  }, [getDataFinancial]);

  return {
    expenseAnalysis,
    totalExpenses,
    totalIncomes,
    financialSummary,
    getDataFinancial,
    isLoading,
  };
};
