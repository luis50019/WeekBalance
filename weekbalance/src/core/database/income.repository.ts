import { getDatabase } from "./database";
import { generateUUID } from "../utils/crypto";

export interface IncomeRecord {
  id: string;
  account_id: string;
  amount: number;
  category: string;
  description: string | null;
  source: string | null;
  created_at: string;
}

export interface CreateIncomeDTO {
  account_id: string;
  amount: number;
  category: string;
  description?: string;
  source?: string;
}

export class IncomeRepository {
  async create(dto: CreateIncomeDTO): Promise<IncomeRecord> {
    const db = await getDatabase();
    const id = generateUUID();

    await db.runAsync(
      `INSERT INTO income_history (id, account_id, amount, category, description, source)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, dto.account_id, dto.amount, dto.category, dto.description || null, dto.source || null]
    );

    await db.runAsync(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
      [dto.amount, dto.account_id]
    );

    const income = await db.getFirstAsync<IncomeRecord>(
      "SELECT * FROM income_history WHERE id = ?",
      [id]
    );
    if (!income) throw new Error("Error al crear ingreso");

    return income;
  }

  async getByAccountId(accountId: string): Promise<IncomeRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<IncomeRecord>(
      "SELECT * FROM income_history WHERE account_id = ? ORDER BY created_at DESC",
      [accountId]
    );
    return results;
  }

  async getRecentByAccountId(accountId: string, limit: number = 5): Promise<IncomeRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<IncomeRecord>(
      "SELECT * FROM income_history WHERE account_id = ? ORDER BY created_at DESC LIMIT ?",
      [accountId, limit]
    );
    return results;
  }
}

export const incomeRepository = new IncomeRepository();
