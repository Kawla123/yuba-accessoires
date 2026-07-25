import { create } from "zustand";

export type Toast = {
  id: number;
  message: string;
  actionLabel?: string;
  actionHref?: string;
};

let nextId = 1;

type ToastState = {
  toasts: Toast[];
  show: (message: string, action?: { label: string; href: string }) => void;
  dismiss: (id: number) => void;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, action) => {
    const id = nextId++;
    set({
      toasts: [
        ...get().toasts,
        { id, message, actionLabel: action?.label, actionHref: action?.href },
      ],
    });
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
