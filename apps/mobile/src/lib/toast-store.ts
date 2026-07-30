import { create } from "zustand";

export type ToastTone = "default" | "ok" | "warn";

export type ToastItem = {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
};

type ToastStore = {
  toasts: ToastItem[];
  show: (input: {
    title: string;
    message?: string;
    tone?: ToastTone;
  }) => void;
  dismiss: (id: string) => void;
};

let seq = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  show: ({ title, message, tone = "default" }) => {
    const id = `t-${Date.now()}-${++seq}`;
    set((s) => ({
      toasts: [...s.toasts.slice(-2), { id, title, message, tone }],
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2800);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function showToast(input: {
  title: string;
  message?: string;
  tone?: ToastTone;
}) {
  useToastStore.getState().show(input);
}
