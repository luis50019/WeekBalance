import { getDatabase } from "./database";
import { Account } from "./auth.repository";

export class AccountRepository {
  async getByUserId(userId: string): Promise<Account | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Account>(
      "SELECT * FROM accounts WHERE user_id = ?",
      [userId],
    );
    return result || null;
  }

  async getById(id: string): Promise<Account | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Account>(
      "SELECT * FROM accounts WHERE id = ?",
      [id],
    );
    return result || null;
  }

  async updateBalance(accountId: string, amount: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE accounts SET balance = balance + ? WHERE id = ?",
      [amount, accountId],
    );
  }

  async setBalance(accountId: string, balance: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("UPDATE accounts SET balance = ? WHERE id = ?", [
      balance,
      accountId,
    ]);
  }
}

export const accountRepository = new AccountRepository();
