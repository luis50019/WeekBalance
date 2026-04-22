export type UpdateFunds = {
  id: string;
  account_id: string;
  amount?: number;
  amountToString: string;
  category?: string;
  description?: string;
  source?: string;
};