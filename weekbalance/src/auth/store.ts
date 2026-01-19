// auth/store.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  user:any | null;
  setSession: (session:any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user:null,
  setSession: (session) => set({ user: session }),
  setToken: (token) => set({ token }),
  logout: () => set({ token: null,user:null }),
}));
