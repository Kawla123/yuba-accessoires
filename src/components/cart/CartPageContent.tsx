"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, X } from "@phosphor-icons/react/ssr";
import { Link } from "@/i18n/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { formatTND } from "@/lib/format";

export function CartPageContent() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Le store persist se réhydrate depuis localStorage après le montage :
  // on évite d'afficher "panier vide" une frame avant l'hydratation.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-4xl text-ink">Votre panier est vide</h1>
        <Link
          href="/boutique"
          className="mt-2 bg-ink px-6 py-3 font-sans text-sm text-cream hover:bg-gold"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-4xl text-ink">Votre panier</h1>

      <ul className="mt-10 divide-y divide-border">
        {items.map((item) => (
          <li
            key={`${item.productSlug}-${item.variantId ?? ""}`}
            className="flex gap-4 py-6"
          >
            <div className="relative h-24 w-20 flex-none overflow-hidden bg-cream-2">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-lg text-ink">{item.name}</p>
                  {item.variantName ? (
                    <p className="font-sans text-xs text-charcoal/60">
                      {item.variantName}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  aria-label="Retirer du panier"
                  onClick={() => removeItem(item.productSlug, item.variantId)}
                  className="text-charcoal/50 hover:text-gold"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    aria-label="Diminuer la quantité"
                    onClick={() =>
                      updateQuantity(
                        item.productSlug,
                        item.quantity - 1,
                        item.variantId,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center hover:text-gold"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-sans text-sm">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Augmenter la quantité"
                    onClick={() =>
                      updateQuantity(
                        item.productSlug,
                        item.quantity + 1,
                        item.variantId,
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center hover:text-gold"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <p className="font-sans text-sm text-ink">
                  {formatTND(item.priceTnd * item.quantity)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
        <p className="font-sans text-sm text-charcoal/70">Sous-total</p>
        <p className="font-serif text-2xl text-ink">{formatTND(subtotal)}</p>
      </div>

      <Link
        href="/commande"
        className="mt-8 block w-full bg-ink px-6 py-4 text-center font-sans text-sm text-cream hover:bg-gold"
      >
        Passer la commande
      </Link>
    </div>
  );
}
