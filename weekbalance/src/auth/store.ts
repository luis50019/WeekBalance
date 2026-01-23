// auth/store.ts
import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { Profile } from "./types/Profile";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;

  setSession: (session: Session, user: User) => void;
  setProfile: (profile: Profile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,

  setSession: (session, user) =>
    set({
      session,
      user
    }),

  setProfile: (profile) => set({ profile }),

  logout: () =>
    set({
      session: null,
      user: null,
      profile: null
    })
}));
