import { getDatabase } from "./database";
import { generateUUID } from "../utils/crypto";

export interface SavingsRecord {
  id: string;
  account_id: string;
  amount: number;
  description: string | null;
  created_at: string;
}

export interface CreateSavingsDTO {
  account_id: string;
  amount: number;
  description?: string;
}

export class SavingsRepository {
  async create(dto: CreateSavingsDTO): Promise<SavingsRecord> {
    const db = await getDatabase();
    const id = generateUUID();

    await db.runAsync(
      `INSERT INTO savings_movements (id, account_id, amount, description)
       VALUES (?, ?, ?, ?)`,
      [id, dto.account_id, dto.amount, dto.description || null]
    );

    await db.runAsync(
      "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      [dto.amount, dto.account_id]
    );

    const savings = await db.getFirstAsync<SavingsRecord>(
      "SELECT * FROM savings_movements WHERE id = ?",
      [id]
    );
    if (!savings) throw new Error("Error al crear movimiento de ahorro");

    return savings;
  }

  async getByAccountId(accountId: string): Promise<SavingsRecord[]> {
    const db = await getDatabase();
    const results = await db.getAllAsync<SavingsRecord>(
      "SELECT * FROM savings_movements WHERE account_id = ? ORDER BY created_at DESC",
      [accountId]
    );
    return results;
  }

  async getTotalByAccountId(accountId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ total: number }>(
      "SELECT COALESCE(SUM(amount), 0) as total FROM savings_movements WHERE account_id = ?",
      [accountId]
    );
    return result?.total || 0;
  }
}

export const savingsRepository = new SavingsRepository();
