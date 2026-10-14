"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/lib/admin-auth-store";
import "@/styles/admin/admin.scss";

type Props = {
  children: React.ReactNode;
};

export function RequireSuperadmin({ children }: Props) {
  const router = useRouter();
  const hydrated = useAdminAuthStore((s) => s.hydrated);
  const accessToken = useAdminAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) {
      router.replace("/admin/login");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) {
    return <div className="admin-loader">Перевіряємо сесію…</div>;
  }

  return <>{children}</>;
}
