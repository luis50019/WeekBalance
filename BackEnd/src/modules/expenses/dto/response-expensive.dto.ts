export interface ExpenseResponseDto {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  description?: string;
  created_at: string;
}
