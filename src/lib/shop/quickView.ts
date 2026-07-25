import { create } from "zustand";

type QuickViewState = {
  openSlug: string | null;
  open: (slug: string) => void;
  close: () => void;
};

export const useQuickView = create<QuickViewState>((set) => ({
  openSlug: null,
  open: (slug) => set({ openSlug: slug }),
  close: () => set({ openSlug: null }),
}));
