// auth/store.ts
import { create } from 'zustand';
import { Profile } from './types/Profile';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  profile: Profile | null;
  user:any | null;
  setSession: (session:any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user:null,
  profile: null,
  setProfile: (profile:Profile) => set({ profile }),
  setSession: (session) => set({ user: session }),
  setToken: (token) => set({ token }),
  logout: () => set({ token: null,user:null }),
}));
