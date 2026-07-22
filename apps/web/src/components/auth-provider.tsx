"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((s) => s.hydrated);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    if (hydrated) {
      void restoreSession();
    }
  }, [hydrated, restoreSession]);

  return <>{children}</>;
}
