import { apiFetch } from "@/lib/client-api";
import type {
  CoupleRequest,
  RequestStatus,
  VendorDashboard,
  VendorRequest,
} from "@/lib/types";

export function getMyRequests() {
  return apiFetch<CoupleRequest[]>("/api/requests");
}

export function createRequest(input: {
  vendorId: string;
  eventDate: string;
  city: string;
  guests: number;
  budget: number;
  message: string;
}) {
  return apiFetch<CoupleRequest>("/api/requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function sendRequestMessage(
  id: string,
  input: { body: string; phone?: string },
) {
  return apiFetch<CoupleRequest | VendorRequest>(
    `/api/requests/${id}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export function getVendorRequests() {
  return apiFetch<VendorRequest[]>("/api/vendor/requests");
}

export function updateVendorRequestStatus(id: string, status: RequestStatus) {
  return apiFetch<VendorRequest>(`/api/vendor/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getVendorDashboard() {
  return apiFetch<VendorDashboard>("/api/vendor/dashboard", { silent: true });
}
