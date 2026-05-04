import type { ExpenseByCategoryWeekly } from "../../../balance/api/expenses.service";
import type { CategoryExpenseAnalysis } from "./types";
import type { ExpenseTransformationStrategy } from "./ExpenseTransformationStrategy";

const FALLBACK_COLOR = "#888888";

export class CategoryExpenseStrategy implements ExpenseTransformationStrategy<CategoryExpenseAnalysis> {
  constructor(
    private readonly categories: ExpenseByCategoryWeekly[],
    private readonly colorMap: Record<string, string>,
  ) {}

  transform(): CategoryExpenseAnalysis[] {
    return this.categories.map((category) => ({
      value: category.percentage,
      color: this.colorMap[category.category] || FALLBACK_COLOR,
      text: category.category,
    }));
  }
}
