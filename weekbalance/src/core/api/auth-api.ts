import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./client";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  account_id?: string;
}

export interface AuthAccount {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: AuthUser;
    profile: AuthProfile;
    session: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      user: AuthUser;
    };
  };
}

export interface RegisterResponse {
  message: string;
  data: {
    user: AuthUser;
    profile: AuthProfile;
  };
}

export interface ApiError {
  message: string;
}

const SESSION_KEY = "@weekbalance_session";

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async register(
    email: string,
    password: string,
    full_name: string
  ): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>("/auth/register", {
      email,
      password,
      full_name,
    });
    return response.data;
  },

  async getAccount(userId: string): Promise<{ data: AuthAccount }> {
    const response = await apiClient.get(`/auth/account/${userId}`);
    return response.data;
  },

  async saveSession(accessToken: string, userId: string): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, accessToken);
    await AsyncStorage.setItem("@weekbalance_user_id", userId);
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
    await AsyncStorage.removeItem("@weekbalance_user_id");
  },

  async getStoredToken(): Promise<string | null> {
    return await AsyncStorage.getItem(SESSION_KEY);
  },
};
