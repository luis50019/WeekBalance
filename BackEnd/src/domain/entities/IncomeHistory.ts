export interface IncomeHistory {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  description?: string | null;
  source?: string | null;
  created_at?: string | Date;
}
