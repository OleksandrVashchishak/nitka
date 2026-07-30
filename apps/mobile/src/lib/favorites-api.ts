import { apiFetch } from "@/lib/client-api";
import type {
  ExternalVendor,
  FavoriteItem,
  VendorPipeline,
  VendorPipelineStage,
} from "@/lib/types";

export function getFavorites() {
  return apiFetch<FavoriteItem[]>("/api/favorites");
}

export function addFavorite(vendorId: string) {
  return apiFetch<FavoriteItem>(`/api/favorites/${vendorId}`, {
    method: "POST",
  });
}

export function removeFavorite(vendorId: string) {
  return apiFetch<{ ok: boolean }>(`/api/favorites/${vendorId}`, {
    method: "DELETE",
  });
}

export function getVendorPipeline() {
  return apiFetch<VendorPipeline>("/api/favorites/pipeline");
}

export function updateCatalogVendorPipeline(
  vendorId: string,
  input: Partial<{
    stage: VendorPipelineStage;
    quotedPrice: number | null;
    notes: string | null;
  }>,
) {
  return apiFetch<FavoriteItem>(`/api/favorites/${vendorId}/pipeline`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function createExternalVendor(input: {
  name: string;
  category: string;
  city?: string;
  phone?: string;
  website?: string;
  quotedPrice?: number;
  notes?: string;
  stage?: VendorPipelineStage;
}) {
  return apiFetch<ExternalVendor>("/api/favorites/manual", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateExternalVendor(
  id: string,
  input: Partial<{
    name: string;
    category: string;
    city: string;
    phone: string | null;
    website: string | null;
    quotedPrice: number | null;
    notes: string | null;
    stage: VendorPipelineStage;
  }>,
) {
  return apiFetch<ExternalVendor>(`/api/favorites/manual/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function removeExternalVendor(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/favorites/manual/${id}`, {
    method: "DELETE",
  });
}
