const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ErrorBody = {
  message?: string | string[];
};

async function parseError(res: Response) {
  try {
    const body = (await res.json()) as ErrorBody;
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return "Щось пішло не так";
}

export type AdminAuthUser = {
  email: string;
  role: "ADMIN";
};

export type AdminLoginResponse = {
  accessToken: string;
  user: AdminAuthUser;
};

export type AdminStats = {
  generatedAt: string;
  users: {
    total: number;
    last7d: number;
    last30d: number;
    emptyAccounts: number;
    active14d: number;
    inactive14d: number;
    neverLoggedIn: number;
  };
  weddings: {
    total: number;
    withPartner: number;
  };
  features: {
    guests: number;
    budget: number;
    tasks: number;
    vendors: number;
    dayPlan: number;
    seating: number;
    publishedWebsite: number;
    invitation: number;
    website: number;
  };
  engagement: {
    rsvpResponded: number;
    pushDevices: number;
  };
  funnel: {
    registered: number;
    withWedding: number;
    withGuests: number;
    withBudget: number;
    withWebsite: number;
    withPublished: number;
    ofRegistered: Record<string, number>;
    ofWeddings: Record<string, number>;
    stepConversion: {
      weddingToGuests: number;
      guestsToBudget: number;
      budgetToWebsite: number;
      websiteToPublished: number;
    };
  };
  dropoff: {
    guestsNoBudget: number;
    budgetNoWebsite: number;
    websiteNotPublished: number;
    dayPlanNoSeating: number;
    guestsNoSeating: number;
    tasksNoBudget: number;
    guestsNoDayPlan: number;
  };
};

export type AdminUserListItem = {
  id: string;
  email: string;
  name: string;
  role: string;
  blocked: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  hasActiveSession: boolean;
  isPartnerOnly: boolean;
  notesCount: number;
  wedding: {
    id: string;
    city: string;
    date: string;
    guestsPlan: number;
    budgetPlan: number;
    planningStage: string;
    guestsCount: number;
    budgetItemsCount: number;
    tasksCount: number;
    partnersCount: number;
    hasDayPlan: boolean;
    hasSeating: boolean;
    websitePublished: boolean;
    websiteSlug: string | null;
    hasInvitation: boolean;
  } | null;
  vendorsCount: number;
  pushDevicesCount: number;
};

export type AdminUsersResponse = {
  page: number;
  limit: number;
  total: number;
  items: AdminUserListItem[];
};

export type AdminNote = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  name: string;
  role: string;
  blocked: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  hasActiveSession: boolean;
  notes: AdminNote[];
  notifications: Record<string, boolean>;
  pushDevices: Array<{ platform: string; updatedAt: string }>;
  vendors: { total: number; byStage: Record<string, number> };
  partnerMembership: {
    role: string;
    weddingId: string;
    owner: { id: string; email: string; name: string };
    city: string;
    date: string;
  } | null;
  wedding: {
    id: string;
    city: string;
    date: string;
    guestsPlan: number;
    budgetPlan: number;
    partnerOneName: string;
    partnerTwoName: string;
    planningStage: string;
    cityUndecided: boolean;
    guestsUndecided: boolean;
    hasDayPlan: boolean;
    hasVendorPlan: boolean;
    hasSeating: boolean;
    guests: {
      total: number;
      rsvp: Record<string, number>;
    };
    budget: {
      items: number;
      estimated: number;
      actual: number;
      paidItems: number;
    };
    tasks: {
      total: number;
      byStatus: Record<string, number>;
    };
    members: Array<{
      role: string;
      user: { id: string; email: string; name: string };
    }>;
    recentInvites: Array<{
      createdAt: string;
      acceptedAt: string | null;
      expiresAt: string;
    }>;
    website: {
      slug: string;
      published: boolean;
      publishedAt: string | null;
      templateId: string;
      updatedAt: string;
    } | null;
    invitation: {
      templateId: string;
      updatedAt: string;
    } | null;
  } | null;
};

export type AdminUsersQuery = {
  q?: string;
  page?: number;
  limit?: number;
  city?: string;
  planningStage?: string;
  dateFrom?: string;
  dateTo?: string;
  activity?: string;
};

async function adminFetch<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json() as Promise<T>;
}

export async function adminLoginRequest(input: {
  email: string;
  password: string;
}): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export function fetchAdminStats(accessToken: string) {
  return adminFetch<AdminStats>("/api/admin/stats", accessToken);
}

export function fetchAdminUsers(
  accessToken: string,
  params?: AdminUsersQuery,
) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.city) search.set("city", params.city);
  if (params?.planningStage) search.set("planningStage", params.planningStage);
  if (params?.dateFrom) search.set("dateFrom", params.dateFrom);
  if (params?.dateTo) search.set("dateTo", params.dateTo);
  if (params?.activity) search.set("activity", params.activity);
  const qs = search.toString();
  return adminFetch<AdminUsersResponse>(
    `/api/admin/users${qs ? `?${qs}` : ""}`,
    accessToken,
  );
}

export function fetchAdminUser(accessToken: string, id: string) {
  return adminFetch<AdminUserDetail>(`/api/admin/users/${id}`, accessToken);
}

export function createAdminNote(
  accessToken: string,
  userId: string,
  body: string,
) {
  return adminFetch<AdminNote>(`/api/admin/users/${userId}/notes`, accessToken, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function deleteAdminNote(
  accessToken: string,
  userId: string,
  noteId: string,
) {
  return adminFetch<{ ok: boolean }>(
    `/api/admin/users/${userId}/notes/${noteId}`,
    accessToken,
    { method: "DELETE" },
  );
}

export type AdminContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  readAt: string | null;
  createdAt: string;
};

export type AdminContactMessagesResponse = {
  page: number;
  limit: number;
  total: number;
  unread: number;
  items: AdminContactMessage[];
};

export function fetchAdminContactMessages(
  accessToken: string,
  params?: { page?: number; limit?: number },
) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return adminFetch<AdminContactMessagesResponse>(
    `/api/admin/contact-messages${qs ? `?${qs}` : ""}`,
    accessToken,
  );
}

export function markAdminContactRead(accessToken: string, id: string) {
  return adminFetch<AdminContactMessage>(
    `/api/admin/contact-messages/${id}/read`,
    accessToken,
    { method: "PATCH" },
  );
}

export function deleteAdminContactMessage(accessToken: string, id: string) {
  return adminFetch<{ ok: boolean }>(
    `/api/admin/contact-messages/${id}`,
    accessToken,
    { method: "DELETE" },
  );
}
