export interface UpdateExpenseDto {
  id: string;
  account_id: string;
  description?: string;
  category?: string;
  amount?: number;
}