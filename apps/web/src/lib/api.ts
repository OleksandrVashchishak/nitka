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

export type VendorReview = {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: { id: string; name: string };
};

export type Vendor = {
  id: string;
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
  category: Category;
  photos: VendorPhoto[];
  packages?: VendorPackage[];
  faqs?: VendorFaq[];
  team?: VendorTeamMember[];
  reviews?: VendorReview[];
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

export type VendorSearchParams = {
  category?: string;
  city?: string;
  price?: string | number;
  rating?: string | number;
  q?: string;
  style?: string;
  sort?: string;
  featured?: string;
};

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const isDev = process.env.NODE_ENV !== "production";

/** Локально — без кешу; в проді — ISR з revalidate. */
function fetchCache(revalidate: number): RequestInit {
  if (isDev) return { cache: "no-store" };
  return { next: { revalidate } };
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(
    `${API_URL}/api/categories`,
    fetchCache(30),
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getVendorFilters(): Promise<VendorFilterOptions> {
  const res = await fetch(
    `${API_URL}/api/vendors/filters`,
    fetchCache(60),
  );
  if (!res.ok) {
    return {
      cities: [],
      styles: [],
      maxPrice: 100000,
      ratings: [4.5, 4, 3.5, 3],
      sorts: [
        { value: "rating", label: "За рейтингом" },
        { value: "price_asc", label: "Ціна ↑" },
        { value: "price_desc", label: "Ціна ↓" },
        { value: "newest", label: "Нові" },
      ],
    };
  }
  return res.json();
}

export async function getVendors(
  params?: VendorSearchParams,
): Promise<Vendor[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.city) query.set("city", params.city);
  if (params?.price) query.set("price", String(params.price));
  if (params?.rating) query.set("rating", String(params.rating));
  if (params?.q) query.set("q", params.q);
  if (params?.style) query.set("style", params.style);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.featured) query.set("featured", params.featured);

  const qs = query.toString();
  const res = await fetch(
    `${API_URL}/api/vendors${qs ? `?${qs}` : ""}`,
    fetchCache(15),
  );
  if (!res.ok) return [];
  return res.json();
}

export async function getVendor(id: string): Promise<Vendor | null> {
  const res = await fetch(
    `${API_URL}/api/vendors/${id}`,
    fetchCache(0),
  );
  if (!res.ok) return null;
  return res.json();
}
