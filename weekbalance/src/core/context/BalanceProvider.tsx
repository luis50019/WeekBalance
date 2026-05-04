import { ReactNode, useEffect, useCallback, createContext, useContext } from "react";
import { useAuthStore } from "../../auth/store";
import { COLORSGRAPIC } from "../../core/constants/Color";
import { CategoryExpenseStrategy } from "../patterns/expenses/CategoryExpenseStrategy";
import { DailyExpenseStrategy } from "../patterns/expenses/DailyExpenseStrategy";
import { ExpenseTransformationContext } from "../patterns/expenses/ExpenseTransformationContext";
import type {
  CategoryExpenseAnalysis,
  DailyExpenseAnalysis,
} from "../patterns/expenses/types";

interface BalanceContextValue {
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  expenseAnalysis: CategoryExpenseAnalysis[];
  dailyExpenseAnalysis: DailyExpenseAnalysis[];
  setChangeValue: () => void;
}

export const BalanceContext = createContext<BalanceContextValue>({
  balance: 0,
  totalExpenses: 0,
  totalIncomes: 0,
  expenseAnalysis: [],
  dailyExpenseAnalysis: [],
  setChangeValue: () => {},
});

export const useBalanceContext = () => useContext(BalanceContext);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const { account, weeklyData, refreshAccount, refreshWeeklyData } = useAuthStore();

  const setChangeValue = useCallback(async () => {
    await refreshAccount();
    await refreshWeeklyData();
  }, [refreshAccount, refreshWeeklyData]);

  // Cargar datos semanales al iniciar
  useEffect(() => {
    if (account) {
      refreshWeeklyData();
    }
  }, [account?.id]);

  // Transformar datos para la gráfica de categorías
  const categoryContext = new ExpenseTransformationContext<CategoryExpenseAnalysis>(
    new CategoryExpenseStrategy(weeklyData.expensesByCategory || [], COLORSGRAPIC),
  );
  const expenseAnalysis = categoryContext.execute();

  const dailyContext = new ExpenseTransformationContext<DailyExpenseAnalysis>(
    new DailyExpenseStrategy(weeklyData.expensesByDay || []),
  );
  const dailyExpenseAnalysis = dailyContext.execute();

  console.log("[BalanceProvider] weeklyData.expensesByDay:", JSON.stringify(weeklyData.expensesByDay));
  console.log("[BalanceProvider] dailyExpenseAnalysis:", JSON.stringify(dailyExpenseAnalysis));

  return (
    <BalanceContext.Provider
      value={{
        balance: account?.balance || 0,
         expenseAnalysis,
         dailyExpenseAnalysis,
        totalExpenses: weeklyData.weeklyExpenses,
        totalIncomes: weeklyData.weeklyIncomes,
        setChangeValue,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
