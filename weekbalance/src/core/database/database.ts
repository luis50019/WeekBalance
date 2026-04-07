import * as SQLite from "expo-sqlite";
import { ALL_TABLES } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabaseAsync("weekbalance.db");
  return db;
};

export const initializeDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.execAsync("PRAGMA foreign_keys = ON;");

  for (const tableQuery of ALL_TABLES) {
    await database.execAsync(tableQuery);
  }

  console.log("[Database] Initialized successfully");
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};
