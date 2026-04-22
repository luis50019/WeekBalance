import { ReactNode, useEffect, useCallback, createContext, useContext } from "react";
import { useAuthStore } from "../../auth/store";
import { COLORSGRAPIC } from "../../core/constants/Color";

interface ExpenseAnalysisItem {
  value: number;
  color: string;
  text: string;
}

interface DailyExpenseItem {
  day: string;
  total: number;
  value: number;
}

interface BalanceContextValue {
  balance: number;
  totalExpenses: number;
  totalIncomes: number;
  expenseAnalysis: ExpenseAnalysisItem[];
  dailyExpenseAnalysis: DailyExpenseItem[];
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
  const expenseAnalysis: ExpenseAnalysisItem[] = (weeklyData.expensesByCategory || []).map(
    (expense) => ({
      value: expense.percentage,
      color: COLORSGRAPIC[expense.category] || "#888",
      text: expense.category,
    })
  );

  // Transformar datos para la gráfica diaria (días de la semana)
  const dailyExpenseAnalysis: DailyExpenseItem[] = (weeklyData.expensesByDay || []).map(
    (expense) => ({
      day: expense.day,
      total: expense.total,
      value: expense.total,
    })
  );

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
