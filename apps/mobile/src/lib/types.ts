export type Role = "COUPLE" | "VENDOR" | "ADMIN" | "GUEST";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
};

export type VendorPhoto = {
  id: string;
  url: string;
  order: number;
};

export type VendorPackage = {
  id: string;
  title: string;
  price: number;
  description: string;
  includes: string;
  duration: string;
  isPopular: boolean;
  order: number;
};

export type VendorFaq = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type VendorTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string | null;
  order: number;
};

export type Vendor = {
  id: string;
  slug?: string | null;
  name: string;
  tagline?: string;
  description: string;
  city: string;
  priceFrom: number;
  priceTo?: number | null;
  rating: number;
  featured?: boolean;
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
  status?: string;
  category: Category;
  photos: VendorPhoto[];
  packages?: VendorPackage[];
  faqs?: VendorFaq[];
  team?: VendorTeamMember[];
  reviews?: Array<{
    id: string;
    rating: number;
    text: string;
    createdAt: string;
    user: { id: string; name: string };
  }>;
  similar?: Vendor[];
  _count?: { reviews: number };
};

export type VendorFilterOptions = {
  cities: string[];
  styles: string[];
  maxPrice: number;
  ratings: number[];
  sorts: Array<{ value: string; label: string }>;
};

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
  tableLabel: string | null;
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

export type RequestStatus = "NEW" | "CONTACTED" | "DONE" | "CLOSED";

export type RequestMessage = {
  id: string;
  body: string;
  phone: string | null;
  authorRole: Role;
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
  status: RequestStatus;
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
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  user: { id: string; name: string; email: string };
  messages: RequestMessage[];
};

export type VendorPipelineStage =
  | "SAVED"
  | "CONTACTED"
  | "MET"
  | "COMPARED"
  | "CHOSEN";

export type FavoriteItem = {
  id: string;
  stage: VendorPipelineStage;
  quotedPrice: number | null;
  notes: string | null;
  vendor: Vendor;
};

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

export type NotificationsSummary = {
  role: string;
  total: number;
  items: Array<{ key: string; label: string; count: number; href: string }>;
  newRequests?: number;
  pendingRsvp?: number;
  newRsvp?: number;
  waitingRequests?: number;
  vendorReplied?: number;
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
    counts: Record<string, number>;
  };
  recommendations: Array<Vendor & { reason: string }>;
};
