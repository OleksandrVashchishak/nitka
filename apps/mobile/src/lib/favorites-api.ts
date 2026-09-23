import { apiFetch } from "@/lib/client-api";
import type {
  ExternalVendor,
  VendorPipeline,
  VendorPipelineStage,
} from "@/lib/types";

export function getVendorPipeline() {
  return apiFetch<VendorPipeline>("/api/favorites/pipeline");
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
