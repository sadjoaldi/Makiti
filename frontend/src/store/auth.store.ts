import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasSeenCityModal: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setHasSeenCityModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasSeenCityModal: false,

      login: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          hasSeenCityModal: false,
        }),

      setUser: (user) => set({ user }),

      setHasSeenCityModal: () => set({ hasSeenCityModal: true }),
    }),
    {
      name: "makiti-auth",
      partialState: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        hasSeenCityModal: state.hasSeenCityModal,
      }),
    },
  ),
);
