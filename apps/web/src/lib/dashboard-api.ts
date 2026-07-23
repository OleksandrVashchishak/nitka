import { apiFetch } from "@/lib/client-api";
import type { Category, Vendor } from "@/lib/api";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type WeddingTask = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
  sortOrder: number;
  isCustom: boolean;
  categorySlug?: string | null;
};

export type Wedding = {
  id: string;
  date: string;
  city: string;
  guests: number;
  budget: number;
  partnerOneName: string;
  partnerTwoName: string;
  couplePhotoUrl: string | null;
  planningStage: string;
  cityUndecided: boolean;
  guestsUndecided: boolean;
  tasks: WeddingTask[];
};

export type FavoriteItem = {
  id: string;
  stage: VendorPipelineStage;
  quotedPrice: number | null;
  notes: string | null;
  vendor: Vendor;
};

export type VendorPipelineStage =
  | "SAVED"
  | "CONTACTED"
  | "MET"
  | "COMPARED"
  | "CHOSEN";

export type ExternalVendor = {
  id: string;
  name: string;
  category: string;
  city: string;
  phone: string | null;
  website: string | null;
  quotedPrice: number | null;
  notes: string | null;
  stage: VendorPipelineStage;
  createdAt: string;
  updatedAt: string;
};

export type VendorPipeline = {
  catalog: FavoriteItem[];
  manual: ExternalVendor[];
};

export type DashboardInsights = {
  city: string;
  plan: {
    done: number;
    total: number;
    progress: number;
    inProgress: number;
  };
  rsvp: {
    total: number;
    yes: number;
    no: number;
    maybe: number;
    pending: number;
  };
  market: {
    average: number;
    vendorsCount: number;
    categories: Array<{
      category: string;
      label: string;
      average: number;
      vendorsCount: number;
    }>;
  };
  budget: {
    total: number;
    perGuest: number;
    estimated: number;
    actual: number;
    paid: number;
    remaining: number;
  };
  pipeline: {
    total: number;
    counts: Record<VendorPipelineStage, number>;
  };
  recommendations: Array<Vendor & { reason: string }>;
};

export type RequestMessage = {
  id: string;
  body: string;
  phone: string | null;
  authorRole: "COUPLE" | "VENDOR" | "ADMIN" | "GUEST";
  createdAt: string;
  author: { id: string; name: string };
};

export type CoupleRequest = {
  id: string;
  eventDate: string;
  city: string;
  guests: number;
  budget: number;
  message: string;
  status: "NEW" | "CONTACTED" | "DONE" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  vendor: Vendor;
  messages: RequestMessage[];
};

export type VendorRequest = {
  id: string;
  eventDate: string;
  city: string;
  guests: number;
  budget: number;
  message: string;
  status: "NEW" | "CONTACTED" | "DONE" | "CLOSED";
  createdAt: string;
  updatedAt?: string;
  user: { id: string; name: string; email: string };
  messages: RequestMessage[];
};

export type VendorDashboard = {
  vendor: Vendor & { status: string };
  stats: {
    views: number;
    views7d: number;
    views30d: number;
    viewsSeries: Array<{ date: string; count: number }>;
    requests: number;
    favorites: number;
    newRequests: number;
  };
} | null;

export function getMyWedding() {
  return apiFetch<Wedding | null>("/api/weddings/me");
}

export function upsertWedding(input: {
  date: string;
  city: string;
  guests: number;
  budget: number;
  partnerOneName?: string;
  partnerTwoName?: string;
  couplePhotoUrl?: string | null;
  planningStage?: string;
  cityUndecided?: boolean;
  guestsUndecided?: boolean;
}) {
  return apiFetch<Wedding>("/api/weddings/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function updateTask(
  taskId: string,
  input: {
    status?: TaskStatus;
    dueDate?: string | null;
    title?: string;
  },
) {
  return apiFetch<WeddingTask>(`/api/weddings/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function createTask(input: {
  title: string;
  categorySlug?: string;
  dueDate?: string;
  sortOrder?: number;
}) {
  return apiFetch<WeddingTask>("/api/weddings/tasks", {
    method: "POST",
    body: JSON.stringify(input),
    successToast: "Задачу додано",
  });
}

export function deleteTask(taskId: string) {
  return apiFetch<{ ok: boolean }>(`/api/weddings/tasks/${taskId}`, {
    method: "DELETE",
    successToast: "Задачу видалено",
  });
}

export function getFavorites() {
  return apiFetch<FavoriteItem[] | null>("/api/favorites", { silent: true }).then(
    (items) => items ?? [],
  );
}

export function addFavorite(vendorId: string) {
  return apiFetch<FavoriteItem>(`/api/favorites/${vendorId}`, {
    method: "POST",
    successToast: "Додано в обране",
  });
}

export function removeFavorite(vendorId: string) {
  return apiFetch<{ ok: boolean }>(`/api/favorites/${vendorId}`, {
    method: "DELETE",
    successToast: "Прибрано з обраного",
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
    successToast: "Статус оновлено",
  });
}

export function createExternalVendor(input: {
  name: string;
  category: string;
  city?: string;
  phone?: string;
  website?: string;
  quotedPrice?: number | null;
  notes?: string;
  stage?: VendorPipelineStage;
}) {
  return apiFetch<ExternalVendor>("/api/favorites/manual", {
    method: "POST",
    body: JSON.stringify(input),
    successToast: "Підрядника додано",
  });
}

export function updateExternalVendor(
  id: string,
  input: Partial<Omit<ExternalVendor, "id" | "createdAt" | "updatedAt">>,
) {
  return apiFetch<ExternalVendor>(`/api/favorites/manual/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function removeExternalVendor(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/favorites/manual/${id}`, {
    method: "DELETE",
    successToast: "Підрядника видалено",
  });
}

export function getDashboardInsights() {
  return apiFetch<DashboardInsights | null>("/api/weddings/me/insights");
}

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
    successToast: "Заявку надіслано",
  });
}

export function getVendorDashboard() {
  return apiFetch<VendorDashboard>("/api/vendor/dashboard");
}

export function getVendorRequests() {
  return apiFetch<VendorRequest[]>("/api/vendor/requests");
}

export function updateVendorRequestStatus(
  id: string,
  status: VendorRequest["status"],
) {
  return apiFetch<VendorRequest>(`/api/vendor/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    successToast: "Статус заявки оновлено",
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

export function getMyVendorProfile() {
  return apiFetch<(Vendor & { status: string }) | null>(
    "/api/vendors/me/profile",
  );
}

export function upsertVendorProfile(input: {
  name: string;
  tagline?: string;
  description: string;
  categoryId: string;
  city: string;
  priceFrom: number;
  priceTo?: number | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  address?: string | null;
  yearsInBusiness?: number | null;
  teamSize?: number | null;
  responseTime?: string | null;
  bookingLeadTime?: string | null;
  availabilityNote?: string;
  videoUrl?: string | null;
  dealTitle?: string | null;
  dealDescription?: string | null;
  styles?: string[];
  services?: string[];
  serviceAreas?: string[];
  languages?: string[];
  photoUrls?: string[];
  packages?: Array<{
    title: string;
    price: number;
    description?: string;
    includes?: string;
    duration?: string;
    isPopular?: boolean;
  }>;
  faqs?: Array<{ question: string; answer: string }>;
  team?: Array<{
    name: string;
    role: string;
    bio?: string;
    photoUrl?: string | null;
  }>;
}) {
  return apiFetch<
    Vendor & {
      status: string;
      packages: Vendor["packages"];
      faqs: Vendor["faqs"];
    }
  >("/api/vendors/me/profile", {
    method: "PUT",
    body: JSON.stringify(input),
    successToast: "Профіль збережено",
  });
}

export type { Category };
