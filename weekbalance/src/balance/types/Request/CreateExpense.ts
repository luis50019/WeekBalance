export type CreateExpense = {
  account_id: string;
  amount: number;
  description: string;
  category: string;
  created_at?: string;
}
