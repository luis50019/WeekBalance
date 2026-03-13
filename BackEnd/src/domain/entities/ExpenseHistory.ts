export interface ExpenseHistory {
  id: string;
  account_id: string;
  category: string;
  amount: number;
  description?: string | null;
  created_at?: string | Date;
}
