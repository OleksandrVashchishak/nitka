import { apiFetch } from "@/lib/client-api";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type TaskAssignee = "owner" | "partner" | "both" | "none" | "other";



export type WeddingTask = {

  id: string;

  title: string;

  status: TaskStatus;

  dueDate: string | null;

  sortOrder: number;

  isCustom: boolean;

  categorySlug?: string | null;

  assignee?: TaskAssignee | null;

};



export type WeddingMember = {

  id: string;

  role: "OWNER" | "PARTNER";

  user: { id: string; name: string; email: string };

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

  myRole?: "OWNER" | "PARTNER";

  members?: WeddingMember[];

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
  manual: ExternalVendor[];
  plan: string[];
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
};



export function getMyWedding() {

  return apiFetch<Wedding | null>("/api/weddings/me");

}



export function createPartnerInvite() {

  return apiFetch<{ token: string; expiresAt: string; path: string }>(

    "/api/weddings/me/partner-invite",

    { method: "POST" },

  );

}



export async function getPartnerInvitePreview(token: string) {

  const api =

    process.env.NEXT_PUBLIC_API_URL ??

    process.env.API_URL ??

    "http://localhost:3001";

  const res = await fetch(`${api}/api/weddings/partner-invite/${token}`, {

    cache: "no-store",

  });

  if (!res.ok) {

    const body = await res.json().catch(() => null);

    throw new Error(

      typeof body?.message === "string"

        ? body.message

        : "Запрошення недійсне",

    );

  }

  return res.json() as Promise<{

    token: string;

    expiresAt: string;

    city: string;

    date: string;

    coupleName: string;

  }>;

}



export function acceptPartnerInvite(token: string) {

  return apiFetch<Wedding>(`/api/weddings/partner-invite/${token}/accept`, {

    method: "POST",

  });

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

    assignee?: TaskAssignee | null;

  },

) {

  return apiFetch<WeddingTask>(`/api/weddings/tasks/${taskId}`, {

    method: "PATCH",

    body: JSON.stringify(input),

  });

}



export function createTask(

  input: {

    title: string;

    categorySlug?: string;

    dueDate?: string;

    sortOrder?: number;

    assignee?: TaskAssignee;

  },

  options?: { silent?: boolean },

) {

  return apiFetch<WeddingTask>("/api/weddings/tasks", {

    method: "POST",

    body: JSON.stringify(input),

    silent: options?.silent,

    successToast: options?.silent ? undefined : "Задачу додано",

  });

}



export function deleteTask(taskId: string) {

  return apiFetch<{ ok: boolean }>(`/api/weddings/tasks/${taskId}`, {

    method: "DELETE",

    successToast: "Задачу видалено",

  });

}



export function getVendorPipeline() {

  return apiFetch<VendorPipeline>("/api/favorites/pipeline");

}



export function saveVendorPlan(categories: string[]) {

  return apiFetch<{ plan: string[] }>("/api/favorites/vendor-plan", {

    method: "PUT",

    body: JSON.stringify({ categories }),

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

