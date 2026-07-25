import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistState = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
};

// Liste d'envies persistée en localStorage (voir échange avec l'utilisateur :
// pas de synchronisation Supabase pour l'instant, à brancher plus tard si
// besoin).
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      has: (slug) => get().slugs.includes(slug),
      toggle: (slug) => {
        const current = get().slugs;
        set({
          slugs: current.includes(slug)
            ? current.filter((s) => s !== slug)
            : [...current, slug],
        });
      },
    }),
    {
      name: "yuba-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
