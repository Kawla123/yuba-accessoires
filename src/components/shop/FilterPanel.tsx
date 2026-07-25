"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PRICE_CEILING = 1000;

export function FilterPanel({
  open,
  onClose,
  total,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  total: number;
  onApply: (values: { priceMin?: number; priceMax?: number; inStockOnly: boolean }) => void;
}) {
  const searchParams = useSearchParams();
  const reducedMotion = usePrefersReducedMotion();

  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(PRICE_CEILING);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPriceMin(Number(searchParams.get("prixMin") ?? 0));
    setPriceMax(Number(searchParams.get("prixMax") ?? PRICE_CEILING));
    setInStockOnly(searchParams.get("stock") === "1");
  }, [open, searchParams]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function handleApply() {
    onApply({
      priceMin: priceMin > 0 ? priceMin : undefined,
      priceMax: priceMax < PRICE_CEILING ? priceMax : undefined,
      inStockOnly,
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="backdrop"
            type="button"
            aria-label="Fermer les filtres"
            onClick={onClose}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/40"
          />
          <motion.div
            key="panel"
            initial={reducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-cream sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-serif text-xl text-ink">Filtres</h2>
              <button type="button" onClick={onClose} aria-label="Fermer">
                <X className="h-5 w-5 text-ink" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div>
                <h3 className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
                  Prix (TND)
                </h3>
                <div className="mt-4 flex items-center justify-between font-sans text-sm text-ink">
                  <span>{priceMin}</span>
                  <span>{priceMax === PRICE_CEILING ? `${PRICE_CEILING}+` : priceMax}</span>
                </div>
                <div className="relative mt-3 h-6">
                  <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-border" />
                  <input
                    type="range"
                    min={0}
                    max={PRICE_CEILING}
                    step={10}
                    value={priceMin}
                    onChange={(e) => setPriceMin(Math.min(Number(e.target.value), priceMax))}
                    className="pointer-events-auto absolute w-full appearance-none bg-transparent accent-gold"
                  />
                  <input
                    type="range"
                    min={0}
                    max={PRICE_CEILING}
                    step={10}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Math.max(Number(e.target.value), priceMin))}
                    className="pointer-events-auto absolute w-full appearance-none bg-transparent accent-gold"
                  />
                </div>
              </div>

              <label className="mt-8 flex items-center gap-2.5 font-sans text-sm text-ink">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                En stock uniquement
              </label>
            </div>

            <div className="border-t border-border px-6 py-5">
              <button
                type="button"
                onClick={handleApply}
                className="w-full bg-ink px-6 py-3.5 font-sans text-sm text-cream transition-colors hover:bg-gold hover:text-ink"
              >
                Voir les résultats ({total})
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
