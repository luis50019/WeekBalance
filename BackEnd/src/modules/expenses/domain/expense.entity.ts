export interface Expense {
  id:string,
  account_id: string;
  category_id: string;
  amount: number;
  description?: string;
  create_at:Date
}
