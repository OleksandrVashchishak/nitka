import { Suspense } from "react";
import { AdminVendorsPage } from "@/components/admin-vendors";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-8 text-ink-soft">Завантаження...</p>}>
      <AdminVendorsPage />
    </Suspense>
  );
}
