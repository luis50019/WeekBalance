export interface ExpenseTransformationStrategy<TResult> {
  transform(): TResult[];
}
