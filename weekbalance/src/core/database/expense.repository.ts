import { getDatabase } from "./database";
import { generateUUID } from "../utils/crypto";

export interface ExpenseRecord {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  description: string | null;
  created_at: string;
}

export interface CreateExpenseDTO {
  account_id: string;
  amount: number;
  category: string;
  description?: string;
}

export class ExpenseRepository {
  async create(dto: CreateExpenseDTO): Promise<ExpenseRecord> {
    const db = await getDatabase();
    const id = generateUUID();

    await db.runAsync(
      `INSERT INTO expense_history (id, account_id, amount, category, description)
       VALUES (?, ?, ?, ?, ?)`,
      [id, dto.account_id, dto.amount, dto.category, dto.description || null]
    );

    await db.runAsync(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      [dto.amount, dto.account_id]
    );

    const expense = await db.getFirstAsync<ExpenseRecord>(
      "SELECT * FROM expense_history WHERE id = ?",
      [id]
    );
    if (!expense) throw new Error("Error al crear gasto");

    return expense;
  }

  async getByAccountId(accountId: string): Promise<ExpenseRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<ExpenseRecord>(
      "SELECT * FROM expense_history WHERE account_id = ? ORDER BY created_at DESC",
      [accountId]
    );
    return results;
  }

  async getRecentByAccountId(accountId: string, limit: number = 5): Promise<ExpenseRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<ExpenseRecord>(
      "SELECT * FROM expense_history WHERE account_id = ? ORDER BY created_at DESC LIMIT ?",
      [accountId, limit]
    );
    return results;
  }

  async getTotalByCategory(accountId: string): Promise<{ category: string; total: number }[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<{ category: string; total: number }>(
      `SELECT category, SUM(amount) as total 
       FROM expense_history 
       WHERE account_id = ? 
       GROUP BY category`,
      [accountId]
    );
    return results;
  }
}

export const expenseRepository = new ExpenseRepository();
