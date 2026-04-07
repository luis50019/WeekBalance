import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Profile, Account, authRepository, getDatabase } from "../core/database";
import { User } from "../core/database/auth.repository";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  account: Account | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
}

const USER_ID_KEY = "@weekbalance_user_id";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  account: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const userId = await AsyncStorage.getItem(USER_ID_KEY);
      if (userId) {
        const user = await authRepository.findUserById(userId);
        if (user) {
          const db = await getDatabase();
          const profile = await db.getFirstAsync<Profile>(
            "SELECT * FROM profiles WHERE user_id = ?",
            [userId]
          );
          const account = await db.getFirstAsync<Account>(
            "SELECT * FROM accounts WHERE user_id = ?",
            [userId]
          );
          
          if (profile && account) {
            set({ user, profile, account, isInitialized: true });
            return;
          }
        }
      }
    } catch (error) {
      console.log("[Auth] Initialize error:", error);
    }
    set({ isInitialized: true });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const result = await authRepository.validateCredentials(email, password);
      if (!result) {
        throw new Error("Credenciales inválidas");
      }

      await AsyncStorage.setItem(USER_ID_KEY, result.user.id);
      set({
        user: result.user,
        profile: result.profile,
        account: result.account,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    try {
      const existingUser = await authRepository.findUserByEmail(email);
      if (existingUser) {
        throw new Error("El correo ya está registrado");
      }

      await authRepository.createUser({
        email,
        password,
        full_name: fullName,
      });

      const result = await authRepository.validateCredentials(email, password);
      if (!result) {
        throw new Error("Error al crear la cuenta");
      }

      await AsyncStorage.setItem(USER_ID_KEY, result.user.id);
      set({
        user: result.user,
        profile: result.profile,
        account: result.account,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(USER_ID_KEY);
    set({
      user: null,
      profile: null,
      account: null,
    });
  },

  refreshAccount: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const db = await getDatabase();
      const account = await db.getFirstAsync<Account>(
        "SELECT * FROM accounts WHERE user_id = ?",
        [user.id]
      );
      if (account) {
        set({ account });
      }
    } catch (error) {
      console.log("[Auth] Refresh account error:", error);
    }
  },
}));
