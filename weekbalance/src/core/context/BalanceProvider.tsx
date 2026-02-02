import { ReactNode, useEffect, useState } from "react";
import { BalanceContext } from "./ContextBalance";
import { useInfoUser } from "../../balance/hooks/useInfoUser";

export const BalanceProvider = ({children}:{ children: ReactNode })=>{
  const { expenseAnalysis,totalExpenses,totalIncomes,financialSummary,getDataFinancial } = useInfoUser();
  const [change, setChange] = useState<boolean>(false);

  const setChangeValue = () => {
    setChange(!change);
  }

  useEffect(()=>{
    getDataFinancial();
  },[change])

  return (<BalanceContext.Provider value={{
    financialSummary: financialSummary,
    expenseAnalysis,
    totalExpenses,
    totalIncomes,
    setChangeValue: setChangeValue,
  }}>
    {children}
  </BalanceContext.Provider>)
}