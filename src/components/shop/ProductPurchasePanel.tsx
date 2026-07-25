"use client";

import { useState } from "react";
import { formatTND } from "@/lib/format";
import { useCartStore } from "@/lib/cart/store";
import { useToastStore } from "@/lib/toast/store";
import type { ShopProductDetail } from "@/lib/queries/products";

export function ProductPurchasePanel({ product }: { product: ShopProductDetail }) {
  const [variantId, setVariantId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === variantId) ?? null;
  const unitPrice = product.priceTnd + (selectedVariant?.priceDelta ?? 0);
  const needsVariant = product.variants.length > 0 && !variantId;

  function handleAdd() {
    addItem({
      productSlug: product.slug,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      name: product.name,
      priceTnd: unitPrice,
      image: product.images[0],
    });
    showToast("Ajouté au panier ✓", { label: "Voir le panier", href: "/panier" });
    setAdded(true);
  }

  return (
    <div>
      <p className="font-sans text-sm text-charcoal/60">{product.categoryName}</p>
      <h1 className="mt-1 font-serif text-4xl text-ink">{product.name}</h1>
      <p className="mt-4 font-sans text-xl text-ink">{formatTND(unitPrice)}</p>
      {product.compareAtPriceTnd ? (
        <p className="font-sans text-sm text-charcoal/50 line-through">
          {formatTND(product.compareAtPriceTnd)}
        </p>
      ) : null}

      {product.descriptionFr ? (
        <p className="mt-6 max-w-md font-sans text-sm text-charcoal/70">
          {product.descriptionFr}
        </p>
      ) : null}

      {product.variants.length > 0 ? (
        <div className="mt-6">
          <p className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">Variante</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={v.stockQuantity === 0}
                onClick={() => setVariantId(v.id)}
                className={`border px-3 py-1.5 font-sans text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  variantId === v.id
                    ? "border-gold bg-gold/10 text-ink"
                    : "border-border text-charcoal/70 hover:border-gold"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        {added ? (
          <div className="flex flex-wrap gap-4">
            <span className="bg-cream-2 px-6 py-3 font-sans text-sm text-ink">
              Ajouté au panier ✓
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock || needsVariant}
            className="bg-ink px-6 py-3 font-sans text-sm text-cream transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
          </button>
        )}
      </div>
    </div>
  );
}
