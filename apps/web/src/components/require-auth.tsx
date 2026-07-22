"use client";

import { PageLoader } from "@/components/ui-loader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import type { Role } from "@/lib/auth-api";
import { getHomePath } from "@/lib/routes";

type Props = {
  children: React.ReactNode;
  roles?: Role[];
};

export function RequireAuth({ children, roles }: Props) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace(getHomePath(user.role));
    }
  }, [hydrated, user, roles, router]);

  if (!hydrated || !user) {
    return (
      <div className="bg-paper px-5 py-10 md:px-8">
        <PageLoader label="Перевіряємо сесію…" />
      </div>
    );
  }

  if (roles && !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
