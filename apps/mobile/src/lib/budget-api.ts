import { apiFetch } from "@/lib/client-api";
import type { BudgetItem, BudgetResponse } from "@/lib/types";

import {
  CABINET_CATEGORIES,
  resolveCabinetCategory,
} from "@/lib/cabinet-categories";

export const BUDGET_CATEGORIES = CABINET_CATEGORIES;

export function categoryLabel(slug: string) {
  const id = resolveCabinetCategory(slug);
  return BUDGET_CATEGORIES.find((c) => c.value === id)?.label ?? "Інше";
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

export type { BudgetItem, BudgetResponse };
