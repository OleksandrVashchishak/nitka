"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type AdminAuthUser,
  adminLoginRequest,
} from "@/lib/admin-api";

type AdminAuthState = {
  user: AdminAuthUser | null;
  accessToken: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),

      login: async (email, password) => {
        const data = await adminLoginRequest({ email, password });
        set({
          user: data.user,
          accessToken: data.accessToken,
        });
      },

      logout: () => {
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "fata-superadmin",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
