export interface ResponseIncomeDto {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  description?: string;
  source?: string;
  created_at: string;
}
