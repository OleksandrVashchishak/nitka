import { apiFetch } from "@/lib/client-api";
import type { Category, Vendor, VendorFaq, VendorPackage } from "@/lib/api";

export type AdminStats = {
  pendingVendors: number;
  approvedVendors: number;
  rejectedVendors: number;
  blockedVendors: number;
  categories: number;
  requests: number;
  couples: number;
  vendors: number;
  views7d: number;
  requests7d: number;
  reviews: number;
  featuredVendors: number;
};

export type AdminVendor = Vendor & {
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
  featured: boolean;
  moderationNote?: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string; blocked?: boolean };
  packages?: VendorPackage[];
  faqs?: VendorFaq[];
  _count: {
    requests: number;
    favorites: number;
    reviews?: number;
    views?: number;
  };
};

export type AdminCategory = Category & {
  description?: string;
  sortOrder?: number;
  _count: { vendors: number };
};

export type AdminRequest = {
  id: string;
  eventDate: string;
  city: string;
  guests: number;
  budget: number;
  message: string;
  status: "NEW" | "CONTACTED" | "DONE" | "CLOSED";
  createdAt: string;
  user: { id: string; name: string; email: string };
  vendor: {
    id: string;
    name: string;
    city: string;
    category: Category;
  };
  messages?: Array<{
    id: string;
    body: string;
    phone: string | null;
    authorRole: string;
    createdAt: string;
    author: { id: string; name: string };
  }>;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "COUPLE" | "VENDOR" | "ADMIN" | "GUEST";
  blocked: boolean;
  createdAt: string;
  vendor: { id: string; name: string; status: string } | null;
  _count: { requests: number; reviews: number };
};

export type AdminUserDetail = AdminUser & {
  wedding: {
    id: string;
    date: string;
    city: string;
    guests: number;
    budget: number;
    partnerOneName: string;
    partnerTwoName: string;
    couplePhotoUrl: string | null;
    _count: { tasks: number; guestList: number; budgetItems: number };
  } | null;
  _count: AdminUser["_count"] & { favorites: number };
};

export type AdminReview = {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  vendor: {
    id: string;
    name: string;
    city: string;
    category: Category;
  };
};

export function getAdminStats() {
  return apiFetch<AdminStats>("/api/admin/stats");
}

export function getAdminVendors(params?: {
  status?: AdminVendor["status"];
  q?: string;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.q) query.set("q", params.q);
  const qs = query.toString();
  return apiFetch<AdminVendor[]>(`/api/admin/vendors${qs ? `?${qs}` : ""}`);
}

export function getAdminVendor(id: string) {
  return apiFetch<AdminVendor>(`/api/admin/vendors/${id}`);
}

export function updateAdminVendorStatus(
  id: string,
  status: AdminVendor["status"],
  moderationNote?: string,
) {
  return apiFetch<AdminVendor>(`/api/admin/vendors/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, moderationNote }),
  });
}

export function setAdminVendorFeatured(id: string, featured: boolean) {
  return apiFetch<AdminVendor>(`/api/admin/vendors/${id}/featured`, {
    method: "PATCH",
    body: JSON.stringify({ featured }),
  });
}

export function updateAdminVendorProfile(
  id: string,
  input: {
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
  },
) {
  return apiFetch<AdminVendor>(`/api/admin/vendors/${id}/profile`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function getAdminCategories() {
  return apiFetch<AdminCategory[]>("/api/admin/categories");
}

export function createAdminCategory(input: {
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
}) {
  return apiFetch<AdminCategory>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAdminCategory(
  id: string,
  input: {
    name: string;
    slug: string;
    description?: string;
    sortOrder?: number;
  },
) {
  return apiFetch<AdminCategory>(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteAdminCategory(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/admin/categories/${id}`, {
    method: "DELETE",
  });
}

export function getAdminRequests(params?: {
  status?: AdminRequest["status"];
  q?: string;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.q) query.set("q", params.q);
  const qs = query.toString();
  return apiFetch<AdminRequest[]>(`/api/admin/requests${qs ? `?${qs}` : ""}`);
}

export function getAdminUsers(params?: {
  role?: AdminUser["role"];
  q?: string;
}) {
  const query = new URLSearchParams();
  if (params?.role) query.set("role", params.role);
  if (params?.q) query.set("q", params.q);
  const qs = query.toString();
  return apiFetch<AdminUser[]>(`/api/admin/users${qs ? `?${qs}` : ""}`);
}

export function getAdminUser(id: string) {
  return apiFetch<AdminUserDetail>(`/api/admin/users/${id}`);
}

export function updateAdminUser(
  id: string,
  input: {
    blocked?: boolean;
    role?: AdminUser["role"];
    name?: string;
    email?: string;
  },
) {
  return apiFetch<AdminUser>(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function updateAdminWedding(
  userId: string,
  input: {
    date: string;
    city: string;
    guests: number;
    budget: number;
    partnerOneName?: string;
    partnerTwoName?: string;
    couplePhotoUrl?: string | null;
  },
) {
  return apiFetch<AdminUserDetail["wedding"]>(
    `/api/admin/users/${userId}/wedding`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
  );
}

export function getAdminReviews() {
  return apiFetch<AdminReview[]>("/api/admin/reviews");
}

export function deleteAdminReview(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/admin/reviews/${id}`, {
    method: "DELETE",
  });
}
