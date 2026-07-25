"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatTND } from "@/lib/format";
import { useQuickView } from "@/lib/shop/quickView";
import { useCartStore } from "@/lib/cart/store";
import { useToastStore } from "@/lib/toast/store";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { fetchQuickViewProduct } from "@/app/actions/products";
import type { ShopProductDetail } from "@/lib/queries/products";

export function QuickViewModal() {
  const openSlug = useQuickView((s) => s.openSlug);
  const close = useQuickView((s) => s.close);
  const reducedMotion = usePrefersReducedMotion();

  const [product, setProduct] = useState<ShopProductDetail | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (!openSlug) {
      setProduct(null);
      return;
    }
    setImageIndex(0);
    setVariantId(null);
    let cancelled = false;
    fetchQuickViewProduct(openSlug).then((data) => {
      if (!cancelled) setProduct(data);
    });
    return () => {
      cancelled = true;
    };
  }, [openSlug]);

  useEffect(() => {
    if (!openSlug) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openSlug, close]);

  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  if (!openSlug) return null;

  const selectedVariant = product?.variants.find((v) => v.id === variantId) ?? null;
  const unitPrice = product ? product.priceTnd + (selectedVariant?.priceDelta ?? 0) : 0;

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productSlug: product.slug,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      name: product.name,
      priceTnd: unitPrice,
      image: product.images[0],
    });
    showToast("Ajouté au panier ✓", { label: "Voir le panier", href: "/panier" });
    close();
  }

  return (
    <AnimatePresence>
      <motion.button
        key="backdrop"
        type="button"
        aria-label="Fermer l'aperçu rapide"
        onClick={close}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
      />
      <motion.div
        key="modal"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto grid max-h-[85vh] max-w-3xl -translate-y-1/2 grid-cols-1 overflow-y-auto bg-cream sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center bg-cream/90 text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        {!product ? (
          <div className="col-span-full flex min-h-[320px] items-center justify-center">
            <div className="h-8 w-8 animate-pulse bg-cream-2" />
          </div>
        ) : (
          <>
            <div className="relative aspect-square bg-cream-2 sm:aspect-auto">
              <Image
                src={product.images[imageIndex]}
                alt={product.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              {product.images.length > 1 ? (
                <>
                  <button
                    type="button"
                    aria-label="Image précédente"
                    onClick={() =>
                      setImageIndex((i) => (i === 0 ? product.images.length - 1 : i - 1))
                    }
                    className="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-cream/80 text-ink"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Image suivante"
                    onClick={() => setImageIndex((i) => (i + 1) % product.images.length)}
                    className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-cream/80 text-ink"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                    {product.images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Photo ${i + 1}`}
                        onClick={() => setImageIndex(i)}
                        className={`h-1.5 w-1.5 ${i === imageIndex ? "bg-gold" : "bg-cream/70"}`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex flex-col px-6 py-6">
              <p className="font-sans text-xs text-charcoal/60">{product.categoryName}</p>
              <h2 className="mt-1 font-serif text-2xl text-ink">{product.name}</h2>
              <p className="mt-2 font-sans text-lg text-ink">{formatTND(unitPrice)}</p>
              {product.descriptionFr ? (
                <p className="mt-4 font-sans text-sm text-charcoal/70">
                  {product.descriptionFr}
                </p>
              ) : null}

              {product.variants.length > 0 ? (
                <div className="mt-5">
                  <p className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
                    Variante
                  </p>
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

              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock || (product.variants.length > 0 && !variantId)}
                  className="w-full bg-ink px-6 py-3.5 font-sans text-sm text-cream transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {product.inStock ? "Ajouter au panier" : "Rupture de stock"}
                </button>
                <Link
                  href={`/produit/${product.slug}`}
                  className="mt-3 block text-center font-sans text-xs text-charcoal/60 underline underline-offset-4 hover:text-gold"
                >
                  Voir la fiche complète
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
