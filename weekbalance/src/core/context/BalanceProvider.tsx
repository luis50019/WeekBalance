import { ReactNode, useEffect, useState, useCallback, createContext, useContext } from "react";
import { useInfoUser } from "../../balance/hooks/useInfoUser";
import { useAuthStore } from "../../auth/store";
import { FinancialSummaryDto } from "../../balance/types/Response/UserInfo.dto";
import { IExpensesAnalisys } from "../interfaces/IExpensesAnlisys";

interface BalanceContextValue {
  financialSummary: FinancialSummaryDto | null;
  totalExpenses: number;
  totalIncomes: number;
  expenseAnalysis: IExpensesAnalisys[];
  setChangeValue: () => void;
}

export const BalanceContext = createContext<BalanceContextValue>({
  financialSummary: null,
  totalExpenses: 0,
  totalIncomes: 0,
  expenseAnalysis: [],
  setChangeValue: () => {},
});

export const useBalanceContext = () => useContext(BalanceContext);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const { account, refreshAccount } = useAuthStore();
  const {
    expenseAnalysis,
    totalExpenses,
    totalIncomes,
    financialSummary,
    getDataFinancial,
    isLoading,
  } = useInfoUser();
  const [change, setChange] = useState(false);

  const setChangeValue = useCallback(async () => {
    setChange(prev => !prev);
    await refreshAccount();
  }, [refreshAccount]);

  useEffect(() => {
    if (!isLoading && account) {
      getDataFinancial();
    }
  }, [change, account?.id]);

  return (
    <BalanceContext.Provider
      value={{
        financialSummary,
        expenseAnalysis,
        totalExpenses,
        totalIncomes,
        setChangeValue,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};
