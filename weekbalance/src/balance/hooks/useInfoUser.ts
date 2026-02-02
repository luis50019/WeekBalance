import { useEffect, useState } from "react"
import { FinancialSummaryDto } from "../types/Response/UserInfo.dto";
import { useAuthStore } from "../../auth/store";
import { getFinancialSummary } from "../api/user.service";
import { IExpensesAnalisys } from "../../core/interfaces/IExpensesAnlisys";
import { COLORSGRAPIC } from "../../core/constants/Color";



export const useInfoUser = () => {
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryDto | null>(null);
  const [totalIncomes, setTotalIncomes] = useState<number | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<number | null>(null);
  const [expenseAnalysis, setExpenseAnalysis] = useState<IExpensesAnalisys[] | null>(null);
  const { profile, session } = useAuthStore();


  const getDataFinancial = async () => {
    try {

      if (!profile?.account_id || !session?.access_token) return;
      const response = await getFinancialSummary(profile?.account_id, session?.access_token);
      console.log(response.data.recentIncomes);
      console.log(response.data.expensesByCategory);
      setFinancialSummary(response.data);

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const incomes = financialSummary?.recentIncomes.map((income) => income.amount).reduce((a, b) => a + b, 0);
    const expenses = financialSummary?.expensesByCategory.map((expense) => expense.total_spent).reduce((a, b) => a + b, 0);
    const expenseAnalysis = financialSummary?.expensesByCategory.map((expense) => {
      return {
        value: expense.percentage,
        color: COLORSGRAPIC[expense.category!],
        text: expense.category
      }
    })
    setExpenseAnalysis(expenseAnalysis!);


    setTotalIncomes(incomes!);
    setTotalExpenses(expenses!);
  }, [financialSummary])

  return { expenseAnalysis, totalExpenses, totalIncomes, financialSummary, getDataFinancial };


}