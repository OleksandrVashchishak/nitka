import { apiFetch } from "@/lib/client-api";
import type { VendorReview } from "@/lib/api";

export type ReviewPayload = {
  vendorId: string;
  rating: number;
  text: string;
};

export function getMyReview(vendorId: string) {
  return apiFetch<VendorReview | null>(`/api/reviews/mine/${vendorId}`);
}

export function createReview(input: ReviewPayload) {
  return apiFetch<VendorReview>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateReview(
  id: string,
  input: { rating: number; text: string },
) {
  return apiFetch<VendorReview>(`/api/reviews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteReview(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/reviews/${id}`, {
    method: "DELETE",
  });
}
