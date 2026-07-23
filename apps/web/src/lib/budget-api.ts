import { apiFetch } from "@/lib/client-api";

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

export type BudgetCategoryGroup = {
  category: string;
  estimated: number;
  actual: number;
  items: BudgetItem[];
};

export type BudgetSummary = {
  totalBudget: number;
  estimated: number;
  actual: number;
  paid: number;
  remaining: number;
  estimatedDiff: number;
  progress: number;
};

export type BudgetResponse = {
  wedding: {
    id: string;
    date: string;
    city: string;
    budget: number;
  };
  summary: BudgetSummary;
  categories: BudgetCategoryGroup[];
  items: BudgetItem[];
};

export const BUDGET_CATEGORIES = [
  { value: "venue", label: "Локація" },
  { value: "catering", label: "Кейтеринг / банкет" },
  { value: "photo", label: "Фото" },
  { value: "video", label: "Відео" },
  { value: "music", label: "Музика / DJ" },
  { value: "host", label: "Ведучий" },
  { value: "decor", label: "Декор і квіти" },
  { value: "cake", label: "Торт" },
  { value: "beauty", label: "Beauty" },
  { value: "attire", label: "Одяг" },
  { value: "rings", label: "Обручки" },
  { value: "transport", label: "Транспорт" },
  { value: "docs", label: "РАЦС / документи" },
  { value: "gifts", label: "Подарунки" },
  { value: "honeymoon", label: "Медовий місяць" },
  { value: "reserve", label: "Резерв" },
  { value: "other", label: "Інше" },
] as const;

export function categoryLabel(slug: string) {
  return BUDGET_CATEGORIES.find((c) => c.value === slug)?.label ?? slug;
}

export function getBudget() {
  return apiFetch<BudgetResponse>("/api/budget");
}

export function updateBudgetPlan(budget: number) {
  return apiFetch<BudgetResponse>("/api/budget/plan", {
    method: "PUT",
    body: JSON.stringify({ budget }),
  });
}

export function createBudgetItem(input: {
  category: string;
  title: string;
  estimated: number;
  actual?: number;
  paid?: boolean;
  notes?: string;
}) {
  return apiFetch<BudgetResponse>("/api/budget/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateBudgetItem(
  id: string,
  input: Partial<{
    category: string;
    title: string;
    estimated: number;
    actual: number;
    paid: boolean;
    notes: string | null;
  }>,
) {
  return apiFetch<BudgetResponse>(`/api/budget/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteBudgetItem(id: string) {
  return apiFetch<BudgetResponse>(`/api/budget/items/${id}`, {
    method: "DELETE",
  });
}
