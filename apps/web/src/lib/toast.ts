import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
};

type ToastState = {
  items: ToastItem[];
  push: (input: {
    tone: ToastTone;
    title: string;
    description?: string;
  }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (input) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({
      items: [...state.items, { id, ...input }].slice(-5),
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: [] }),
}));

export const toast = {
  success(title: string, description?: string) {
    return useToastStore.getState().push({ tone: "success", title, description });
  },
  error(title: string, description?: string) {
    return useToastStore.getState().push({ tone: "error", title, description });
  },
  info(title: string, description?: string) {
    return useToastStore.getState().push({ tone: "info", title, description });
  },
};

export function getErrorMessage(err: unknown, fallback = "Щось пішло не так") {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err.trim()) return err;
  return fallback;
}
