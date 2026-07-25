"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { useToastStore } from "@/lib/toast/store";
import { useFlyingDots } from "@/lib/cart/flyingDots";
import { flyToCartTarget } from "@/lib/cart/flyToCartTarget";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ShopProduct } from "@/lib/queries/products";

export function QuickAddButton({
  product,
  className,
}: {
  product: ShopProduct;
  className?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const addFlyingDot = useFlyingDots((s) => s.add);
  const reducedMotion = usePrefersReducedMotion();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!product.inStock) return;

    addItem({
      productSlug: product.slug,
      name: product.name,
      priceTnd: product.priceTnd,
      image: product.images[0],
    });

    showToast("Ajouté au panier ✓", { label: "Voir le panier", href: "/panier" });

    if (!reducedMotion && flyToCartTarget.current) {
      const from = e.currentTarget.getBoundingClientRect();
      addFlyingDot(from, flyToCartTarget.current, product.images[0]);
    }
  }

  if (!product.inStock) {
    return (
      <span
        className={`block bg-charcoal/20 px-3 py-2.5 text-center font-sans text-xs text-cream/70 ${className ?? ""}`}
      >
        Rupture de stock
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex w-full items-center justify-center gap-2 bg-ink px-3 py-2.5 font-sans text-xs text-cream transition-colors hover:bg-gold hover:text-ink ${className ?? ""}`}
    >
      <ShoppingBag className="h-3.5 w-3.5" />
      Ajout rapide
    </button>
  );
}
