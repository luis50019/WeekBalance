export interface CreateWeeklyGoalDto {
  account_id: string;
  target_amount: number;
  week_start: string;
  week_end: string;
}
