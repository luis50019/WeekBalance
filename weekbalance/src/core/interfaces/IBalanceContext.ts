import { FinancialSummaryDto } from "../../balance/types/Response/UserInfo.dto";
import { IExpensesAnalisys } from "./IExpensesAnlisys";

export interface IBalanceContext{
  financialSummary:FinancialSummaryDto|null,
  totalIncomes: number | null,
  totalExpenses: number | null,
  expenseAnalysis:IExpensesAnalisys[] | null,
  setChangeValue: ()=>void,
}