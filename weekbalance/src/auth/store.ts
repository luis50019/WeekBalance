import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, AuthUser, AuthProfile, AuthAccount } from "../core/api/auth-api";

interface AuthState {
  user: AuthUser | null;
  profile: AuthProfile | null;
  account: AuthAccount | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  account: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const hasToken = await authApi.getStoredToken();
      if (hasToken) {
        // Hay sesión guardada - marcar para re-autenticación
        console.log("[Auth] Token found, session exists");
      }
    } catch (error) {
      console.log("[Auth] Initialize error:", error);
    }
    set({ isInitialized: true });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const result = await authApi.login(email, password);

      // Guardar session token
      await authApi.saveSession(result.data.session.access_token, result.data.user.id);

      // Obtener account
      const accountResponse = await authApi.getAccount(result.data.user.id);

      set({
        user: result.data.user,
        profile: result.data.profile,
        account: accountResponse.data,
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
      await authApi.register(email, password, fullName);

      // Después de registrar, automáticamente iniciamos sesión
      const result = await authApi.login(email, password);

      await authApi.saveSession(result.data.session.access_token, result.data.user.id);

      // Obtener account
      const accountResponse = await authApi.getAccount(result.data.user.id);

      set({
        user: result.data.user,
        profile: result.data.profile,
        account: accountResponse.data,
        isLoading: false,
      });
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
    });
  },

  refreshAccount: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const accountResponse = await authApi.getAccount(user.id);
      set({ account: accountResponse.data });
    } catch (error) {
      console.error("[Auth] Error refreshing account:", error);
    }
  },
}));