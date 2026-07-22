import { Suspense } from "react";
import { AdminUsersPage } from "@/components/admin-users";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-ink-soft">Завантаження...</p>}>
      <AdminUsersPage />
    </Suspense>
  );
}
