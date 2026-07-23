/** Публічний URL картки підрядника (slug, з fallback на id). */
export function vendorHref(vendor: { id: string; slug?: string | null }) {
  return `/vendors/${vendor.slug || vendor.id}`;
}
