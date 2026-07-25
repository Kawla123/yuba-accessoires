"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatTND, formatEURFromCents } from "@/lib/format";
import { useQuickView } from "@/lib/shop/quickView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { WishlistHeartButton } from "./WishlistHeartButton";
import { QuickAddButton } from "./QuickAddButton";
import { ProductViewfinder } from "./ProductViewfinder";
import type { ShopProduct } from "@/lib/queries/products";

export function ProductCard({ product }: { product: ShopProduct }) {
  const openQuickView = useQuickView((s) => s.open);
  const reducedMotion = usePrefersReducedMotion();
  const canSwap = product.images.length > 1 && !reducedMotion;
  const [viewfinderActive, setViewfinderActive] = useState(false);

  return (
    <div className="group">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-cream-2"
        onMouseEnter={() => setViewfinderActive(true)}
        onMouseLeave={() => setViewfinderActive(false)}
        onFocus={() => setViewfinderActive(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setViewfinderActive(false);
          }
        }}
      >
        {!reducedMotion ? (
          <ProductViewfinder name={product.name} active={viewfinderActive} />
        ) : null}
        <button
          type="button"
          onClick={() => openQuickView(product.slug)}
          aria-label={`Aperçu rapide — ${product.name}`}
          className="absolute inset-0 z-0"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 24vw, 45vw"
            className={`object-cover ${canSwap ? "transition-opacity duration-500 group-hover:opacity-0" : ""}`}
          />
          {canSwap ? (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1024px) 24vw, 45vw"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}
        </button>

        {product.isNew ? (
          <span className="pointer-events-none absolute top-3 left-3 z-10 bg-gold px-2.5 py-1 font-sans text-[11px] tracking-wide text-ink uppercase">
            Nouveau
          </span>
        ) : !product.inStock ? (
          <span className="pointer-events-none absolute top-3 left-3 z-10 bg-charcoal/60 px-2.5 py-1 font-sans text-[11px] tracking-wide text-cream uppercase">
            Rupture de stock
          </span>
        ) : null}

        <WishlistHeartButton slug={product.slug} className="absolute top-3 right-3 z-10" />

        <div
          className={`absolute inset-x-0 bottom-0 z-10 ${
            reducedMotion
              ? ""
              : "translate-y-full transition-transform duration-300 md:group-hover:translate-y-0"
          }`}
        >
          <QuickAddButton product={product} />
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/produit/${product.slug}`}
            className="font-serif text-lg text-ink hover:text-gold"
          >
            {product.name}
          </Link>
          <p className="font-sans text-xs text-charcoal/60">{product.categoryName}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sans text-sm text-ink">{formatTND(product.priceTnd)}</p>
          {product.compareAtPriceTnd ? (
            <p className="font-sans text-xs text-charcoal/50 line-through">
              {formatTND(product.compareAtPriceTnd)}
            </p>
          ) : null}
          <p className="font-sans text-xs text-charcoal/50">
            {formatEURFromCents(product.priceTnd)}
          </p>
        </div>
      </div>
    </div>
  );
}
