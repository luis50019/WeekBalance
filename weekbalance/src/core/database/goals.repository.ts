import { getDatabase } from "./database";
import { generateUUID } from "../utils/crypto";

export interface WeeklyGoalRecord {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  week_start: string;
  week_end: string;
  created_at: string;
}

export interface CreateWeeklyGoalDTO {
  account_id: string;
  amount: number;
  category: string;
  week_start: string;
  week_end: string;
}

export class WeeklyGoalsRepository {
  async create(dto: CreateWeeklyGoalDTO): Promise<WeeklyGoalRecord> {
    const existing = await this.getCurrentWeekGoals(dto.account_id, dto.week_start, dto.week_end);
    if (existing.length > 0) {
      throw new Error("No puedes crear una meta hasta que finalice la semana");
    }

    const db = await getDatabase();
    const id = generateUUID();

    await db.runAsync(
      `INSERT INTO weekly_goals (id, account_id, amount, category, week_start, week_end)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, dto.account_id, dto.amount, dto.category, dto.week_start, dto.week_end]
    );

    const goal = await db.getFirstAsync<WeeklyGoalRecord>(
      "SELECT * FROM weekly_goals WHERE id = ?",
      [id]
    );
    if (!goal) throw new Error("Error al crear meta semanal");

    return goal;
  }

  async getByAccountId(accountId: string): Promise<WeeklyGoalRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<WeeklyGoalRecord>(
      "SELECT * FROM weekly_goals WHERE account_id = ? ORDER BY week_start DESC",
      [accountId]
    );
    return results;
  }

  async getCurrentWeekGoals(accountId: string, weekStart: string, weekEnd: string): Promise<WeeklyGoalRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<WeeklyGoalRecord>(
      `SELECT * FROM weekly_goals 
       WHERE account_id = ? AND week_start = ? AND week_end = ?`,
      [accountId, weekStart, weekEnd]
    );
    return results;
  }

  async hasGoalForWeek(accountId: string, weekStart: string, weekEnd: string): Promise<boolean> {
    const goals = await this.getCurrentWeekGoals(accountId, weekStart, weekEnd);
    return goals.length > 0;
  }

  async getSpentForWeek(accountId: string, category: string, weekStart: string, weekEnd: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      `SELECT COALESCE(SUM(amount), 0) as total 
       FROM expense_history 
       WHERE account_id = ? AND category = ? 
       AND created_at >= ? AND created_at <= ?`,
      [accountId, category, weekStart, weekEnd]
    );
    return result?.total || 0;
  }

  async update(id: string, amount: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("UPDATE weekly_goals SET amount = ? WHERE id = ?", [amount, id]);
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM weekly_goals WHERE id = ?", [id]);
  }
}

export const weeklyGoalsRepository = new WeeklyGoalsRepository();
