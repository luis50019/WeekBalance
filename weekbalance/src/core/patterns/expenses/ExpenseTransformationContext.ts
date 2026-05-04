import type { ExpenseTransformationStrategy } from "./ExpenseTransformationStrategy";

export class ExpenseTransformationContext<TResult> {
  constructor(private strategy: ExpenseTransformationStrategy<TResult>) {}

  setStrategy(strategy: ExpenseTransformationStrategy<TResult>): void {
    this.strategy = strategy;
  }

  execute(): TResult[] {
    return this.strategy.transform();
  }
}
