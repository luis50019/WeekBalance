export type WeeklyGoalStatus = "active" | "completed" | "failed";

export interface WeeklyGoal {
  id: string;
  account_id: string;
  target_amount: number;
  week_start: string;
  week_end: string;
  status?: WeeklyGoalStatus;
  created_at?: string | Date;
}
