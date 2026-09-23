export type Role = "COUPLE" | "GUEST";

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

export type RsvpStatus = "PENDING" | "YES" | "NO" | "MAYBE";
export type GuestSide = "BRIDE" | "GROOM" | "BOTH" | "OTHER";

export type Guest = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  side: GuestSide;
  rsvpStatus: RsvpStatus;
  plusOne: boolean;
  plusOneName: string | null;
  plusOneAttending: boolean | null;
  allergies: string | null;
  notes: string | null;
  inviteToken: string;
  respondedAt: string | null;
  createdAt: string;
};

export type GuestListResponse = {
  wedding: {
    id: string;
    date: string;
    city: string;
    plannedGuests: number;
  };
  stats: {
    total: number;
    yes: number;
    no: number;
    maybe: number;
    pending: number;
    headcount: number;
  };
  guests: Guest[];
};

export type BudgetItem = {
  id: string;
  category: string;
  title: string;
  estimated: number;
  actual: number;
  paid: boolean;
  notes: string | null;
  createdAt: string;
};

export type BudgetResponse = {
  wedding: { id: string; date: string; city: string; budget: number };
  summary: {
    totalBudget: number;
    estimated: number;
    actual: number;
    paid: number;
    remaining: number;
    estimatedDiff: number;
    progress: number;
  };
  categories: Array<{
    category: string;
    estimated: number;
    actual: number;
    items: BudgetItem[];
  }>;
  items: BudgetItem[];
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
};

export type NotificationsSummary = {
  role: string;
  total: number;
  newCount?: number;
  items: Array<{ key: string; label: string; count: number; href: string }>;
  feed?: Array<{
    id: string;
    body: string;
    href: string;
    createdAt: string;
    isNew: boolean;
    actionLabel?: string;
    actionHref?: string;
  }>;
  moreHref?: string;
  pendingRsvp?: number;
  newRsvp?: number;
};

export type ContentTopic = {
  id: string;
  slug: string;
  name: string;
  title?: string;
  description?: string | null;
  icon?: string | null;
  coverUrl?: string | null;
};

export type ContentPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl?: string | null;
  kind?: string;
  featured?: boolean;
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
    counts: Record<string, number>;
  };
};
