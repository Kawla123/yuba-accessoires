import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { CollectionToolbar } from "@/components/shop/CollectionToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/shop/QuickViewModal";
import {
  getAllActiveCategories,
  getProductsByGender,
  type SortOption,
} from "@/lib/queries/products";

const SORT_VALUES: SortOption[] = ["nouveautes", "prix-asc", "prix-desc", "popularite"];

export const metadata: Metadata = {
  title: "Toute la collection",
  description:
    "Bijoux, sacs, montres, lunettes et accessoires traditionnels djerbiens, pour homme et femme — toute la collection Yuba Accessoires.",
};

export default async function BoutiquePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    categorie?: string;
    tri?: string;
    prixMin?: string;
    prixMax?: string;
    stock?: string;
  }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const sort: SortOption = SORT_VALUES.includes(sp.tri as SortOption)
    ? (sp.tri as SortOption)
    : "nouveautes";

  const [categories, { products, total }] = await Promise.all([
    getAllActiveCategories(),
    getProductsByGender({
      categorySlug: sp.categorie,
      sort,
      priceMinTnd: sp.prixMin ? Number(sp.prixMin) : undefined,
      priceMaxTnd: sp.prixMax ? Number(sp.prixMax) : undefined,
      inStockOnly: sp.stock === "1",
    }),
  ]);

  return (
    <main className="flex-1">
      <CollectionHero
        title="Boutique"
        subtitle="Découvrez toute la collection Yuba Accessoires — bijoux, sacs, montres, lunettes et accessoires traditionnels djerbiens, pour homme et femme."
        image="/images/collection-homme.jpg"
      />
      <CollectionToolbar
        total={total}
        categories={categories}
        activeCategory={sp.categorie}
        sort={sort}
      />
      <ProductGrid products={products} />
      <QuickViewModal />
    </main>
  );
}
