import { FinancialSummaryDto } from "../../balance/types/Response/UserInfo.dto";
import { IExpensesAnalisys } from "./IExpensesAnlisys";

export interface IBalanceContext{
  financialSummary:FinancialSummaryDto|null,
  totalIncomes: number,
  totalExpenses: number,
  expenseAnalysis:IExpensesAnalisys[],
  setChangeValue: ()=>void,
}
