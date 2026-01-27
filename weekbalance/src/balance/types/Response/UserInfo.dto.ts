
export interface RecentIncomeDto {
  id: string;
  amount: number;
  description: string | null;
  source: string | null;
  created_at: string; // ISO date
}

export interface ExpenseCategoryPercentageDto {
  category: string;
  total_spent: number;
  percentage: number;
}


export interface FinancialSummaryDto {
  balance?: number;
  recentIncomes: RecentIncomeDto[];
  expensesByCategory: ExpenseCategoryPercentageDto[];
}
