export interface UpdateIncomeDto {
  id: string;
  account_id: string;
  description?: string;
  category?: string;
  amount?: number;
  source?: string;
}