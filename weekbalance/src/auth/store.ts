import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, AuthUser, AuthProfile, AuthAccount } from "../core/api/auth-api";
import { getWeeklyTotal as getIncomesWeeklyTotal } from "../balance/api/funds.service";
import { getWeeklyTotal as getExpensesWeeklyTotal, getWeeklyByCategory, getWeeklyByDay, ExpenseByCategoryWeekly, ExpenseByDay } from "../balance/api/expenses.service";

interface WeeklyData {
  weeklyIncomes: number;
  weeklyExpenses: number;
  expensesByCategory: ExpenseByCategoryWeekly[];
  expensesByDay: ExpenseByDay[];
}

interface AuthState {
  user: AuthUser | null;
  profile: AuthProfile | null;
  account: AuthAccount | null;
  weeklyData: WeeklyData;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  refreshWeeklyData: () => Promise<void>;
}

const initialWeeklyData: WeeklyData = {
  weeklyIncomes: 0,
  weeklyExpenses: 0,
  expensesByCategory: [],
  expensesByDay: [],
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  account: null,
  weeklyData: initialWeeklyData,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const hasToken = await authApi.getStoredToken();
      if (hasToken) {
        // Token found, session exists
      }
    } catch (error) {
      // Silent fail on initialize
    }
    set({ isInitialized: true });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const result = await authApi.login(email, password);

      // Guardar session token
      await authApi.saveSession(result.data.session.access_token, result.data.user.id);

      set({
        user: result.data.user,
        profile: result.data.profile,
        account: result.data.account,
        isLoading: false,
      });

      // Obtener datos semanales
      await get().refreshWeeklyData();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    try {
      await authApi.register(email, password, fullName);

      // Después de registrar, automáticamente iniciamos sesión
      const result = await authApi.login(email, password);

      await authApi.saveSession(result.data.session.access_token, result.data.user.id);

      set({
        user: result.data.user,
        profile: result.data.profile,
        account: result.data.account,
        isLoading: false,
      });

      // Obtener datos semanales
      await get().refreshWeeklyData();
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await authApi.clearSession();
    set({
      user: null,
      profile: null,
      account: null,
      weeklyData: initialWeeklyData,
    });
  },

  refreshAccount: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const [accountResponse, profileResponse] = await Promise.all([
        authApi.getAccount(user.id),
        authApi.getProfile(user.id),
      ]);
      set({ 
        account: accountResponse.data,
        profile: profileResponse.data,
      });
    } catch (error) {
      // Silent fail on refresh account
    }
  },

  refreshWeeklyData: async () => {
    const { account } = get();
    if (!account) return;

    try {
      // Refreshing weekly data
      const [weeklyIncomes, weeklyExpenses, expensesByCategory, expensesByDay] = await Promise.all([
        getIncomesWeeklyTotal(account.id),
        getExpensesWeeklyTotal(account.id),
        getWeeklyByCategory(account.id),
        getWeeklyByDay(account.id),
      ]);

      // Weekly data response received

      set({
        weeklyData: {
          weeklyIncomes,
          weeklyExpenses,
          expensesByCategory: expensesByCategory.categories || [],
          expensesByDay: expensesByDay || [],
        },
      });

      // Weekly data set
    } catch (error) {
      // Silent fail on refresh weekly data
    }
  },
}));
