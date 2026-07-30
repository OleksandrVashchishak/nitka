import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  AuthUser,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  registerRequest,
} from "@/lib/auth-api";
import { unregisterPushAsync } from "@/lib/push";
import { secureStorage } from "@/lib/secure-storage";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    name: string;
    role: "COUPLE" | "VENDOR";
  }) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),

      login: async (email, password) => {
        const data = await loginRequest({ email, password });
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      },

      register: async (input) => {
        const data = await registerRequest(input);
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      },

      logout: async () => {
        const token = get().accessToken;
        try {
          await unregisterPushAsync();
        } catch {
          /* ignore */
        }
        try {
          if (token) await logoutRequest(token);
        } finally {
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },

      restoreSession: async () => {
        const { accessToken, refreshToken } = get();
        if (!accessToken && !refreshToken) return;

        try {
          if (accessToken) {
            const user = await meRequest(accessToken);
            set({ user });
            return;
          }
        } catch {
          /* try refresh */
        }

        if (!refreshToken) {
          set({ user: null, accessToken: null, refreshToken: null });
          return;
        }

        try {
          const data = await refreshRequest(refreshToken);
          set({
            user: data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        } catch {
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },
    }),
    {
      name: "nitka-auth",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
