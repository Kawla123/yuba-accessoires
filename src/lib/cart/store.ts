import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productSlug: string;
  variantId?: string;
  variantName?: string;
  name: string;
  priceTnd: number; // prix unitaire en centimes, capturé à l'ajout
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productSlug: string, variantId?: string) => void;
  updateQuantity: (
    productSlug: string,
    quantity: number,
    variantId?: string,
  ) => void;
  clear: () => void;
};

function sameLine(
  a: { productSlug: string; variantId?: string },
  b: { productSlug: string; variantId?: string },
) {
  return a.productSlug === b.productSlug && a.variantId === b.variantId;
}

// Panier client persisté en localStorage : ce n'est pas un artifact
// Claude (application Next.js réelle exécutée dans le navigateur du
// visiteur), localStorage est donc un choix légitime ici.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => sameLine(i, item));
        if (existing) {
          set({
            items: get().items.map((i) =>
              sameLine(i, item)
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },

      removeItem: (productSlug, variantId) => {
        set({
          items: get().items.filter(
            (i) => !sameLine(i, { productSlug, variantId }),
          ),
        });
      },

      updateQuantity: (productSlug, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productSlug, variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            sameLine(i, { productSlug, variantId }) ? { ...i, quantity } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "yuba-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceTnd * i.quantity, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
