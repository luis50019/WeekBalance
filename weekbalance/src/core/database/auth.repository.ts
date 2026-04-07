import { getDatabase } from "./database";
import { generateUUID, hashPassword, verifyPassword } from "../utils/crypto";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginResult {
  user: User;
  profile: Profile;
  account: Account;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
}

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return result || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return result || null;
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const db = await getDatabase();
    const userId = generateUUID();
    const passwordHash = hashPassword(dto.password);

    await db.runAsync(
      "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
      [userId, dto.email, passwordHash]
    );

    const profileId = generateUUID();
    await db.runAsync(
      "INSERT INTO profiles (id, user_id, full_name, avatar_url) VALUES (?, ?, ?, ?)",
      [profileId, userId, dto.full_name, null]
    );

    const accountId = generateUUID();
    await db.runAsync(
      "INSERT INTO accounts (id, user_id, balance) VALUES (?, ?, ?)",
      [accountId, userId, 0]
    );

    const user = await this.findUserById(userId);
    if (!user) throw new Error("Error al crear usuario");

    return user;
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<LoginResult | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) return null;

    const db = await getDatabase();
    const profile = await db.getFirstAsync<Profile>(
      "SELECT * FROM profiles WHERE user_id = ?",
      [user.id]
    );
    if (!profile) return null;

    const account = await db.getFirstAsync<Account>(
      "SELECT * FROM accounts WHERE user_id = ?",
      [user.id]
    );
    if (!account) return null;

    return { user, profile, account };
  }
}

export const authRepository = new AuthRepository();
