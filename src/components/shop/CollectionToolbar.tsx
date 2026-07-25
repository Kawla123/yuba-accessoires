"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { ShopCategory, SortOption } from "@/lib/queries/products";
import { FilterPanel } from "./FilterPanel";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "nouveautes", label: "Nouveautés" },
  { value: "prix-asc", label: "Prix croissant" },
  { value: "prix-desc", label: "Prix décroissant" },
  { value: "popularite", label: "Popularité" },
];

export function CollectionToolbar({
  total,
  categories,
  activeCategory,
  sort,
}: {
  total: number;
  categories: ShopCategory[];
  activeCategory?: string;
  sort: SortOption;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  function pushParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <div className="border-b border-border px-6 py-5 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-sans text-sm text-charcoal/60">
            {total} {total > 1 ? "pièces" : "pièce"}
          </p>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => pushParams({ tri: e.target.value })}
              className="border border-ink bg-ink px-3 py-2 font-sans text-xs text-cream outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 border border-ink px-3 py-2 font-sans text-xs text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtres
            </button>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <CategoryChip
              label="Tout"
              active={!activeCategory}
              onClick={() => pushParams({ categorie: undefined })}
            />
            {categories.map((cat) => (
              <CategoryChip
                key={cat.slug}
                label={cat.name}
                active={activeCategory === cat.slug}
                onClick={() => pushParams({ categorie: cat.slug })}
              />
            ))}
          </div>
        ) : null}
      </div>

      <FilterPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        total={total}
        onApply={(values) =>
          pushParams({
            prixMin: values.priceMin !== undefined ? String(values.priceMin) : undefined,
            prixMax: values.priceMax !== undefined ? String(values.priceMax) : undefined,
            stock: values.inStockOnly ? "1" : undefined,
          })
        }
      />
    </>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none px-4 py-1.5 font-sans text-xs whitespace-nowrap transition-colors ${
        active ? "bg-gold text-ink" : "border border-border text-charcoal/70 hover:border-gold"
      }`}
    >
      {label}
    </button>
  );
}
