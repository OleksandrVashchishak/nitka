import { apiFetch } from "@/lib/client-api";
import { getApiUrl } from "@/lib/api-url";
import type {
  Category,
  Vendor,
  VendorFilterOptions,
} from "@/lib/types";

export type VendorSearchParams = {
  category?: string;
  city?: string;
  q?: string;
  sort?: string;
  featured?: string;
  price?: string | number;
  rating?: string | number;
  style?: string;
};

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${getApiUrl()}/api/categories`);
  if (!res.ok) throw new Error("Не вдалося завантажити категорії");
  return res.json();
}

export async function getVendorFilters(): Promise<VendorFilterOptions> {
  const res = await fetch(`${getApiUrl()}/api/vendors/filters`);
  if (!res.ok) throw new Error("Не вдалося завантажити фільтри");
  return res.json();
}

export async function getVendors(
  params: VendorSearchParams = {},
): Promise<Vendor[]> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) {
      qs.set(k, String(v));
    }
  });
  const res = await fetch(
    `${getApiUrl()}/api/vendors${qs.toString() ? `?${qs}` : ""}`,
  );
  if (!res.ok) throw new Error("Не вдалося завантажити каталог");
  return res.json();
}

export async function getVendor(slugOrId: string): Promise<Vendor> {
  const res = await fetch(`${getApiUrl()}/api/vendors/${slugOrId}`);
  if (!res.ok) throw new Error("Підрядника не знайдено");
  return res.json();
}

export function getMyVendorProfile() {
  return apiFetch<(Vendor & { status: string }) | null>(
    "/api/vendors/me/profile",
    { silent: true },
  );
}

export function upsertMyVendorProfile(input: {
  name: string;
  description: string;
  categoryId: string;
  city: string;
  priceFrom: number;
  priceTo?: number | null;
  phone?: string;
  website?: string;
  instagram?: string;
  tagline?: string;
  photoUrls?: string[];
}) {
  return apiFetch<Vendor & { status: string }>("/api/vendors/me/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
