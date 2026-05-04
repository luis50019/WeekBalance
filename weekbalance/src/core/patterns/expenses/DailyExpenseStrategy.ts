import type { ExpenseByDay } from "../../../balance/api/expenses.service";
import type { DailyExpenseAnalysis } from "./types";
import type { ExpenseTransformationStrategy } from "./ExpenseTransformationStrategy";

export class DailyExpenseStrategy implements ExpenseTransformationStrategy<DailyExpenseAnalysis> {
  constructor(private readonly expenses: ExpenseByDay[]) {}

  transform(): DailyExpenseAnalysis[] {
    return this.expenses.map((expense) => ({
      day: expense.day,
      total: expense.total,
      value: expense.total,
    }));
  }
}
