import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CollectionHero } from "@/components/shop/CollectionHero";
import { EditorialZoomSection } from "@/components/shop/EditorialZoomSection";
import { CollectionToolbar } from "@/components/shop/CollectionToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/shop/QuickViewModal";
import {
  getCategoriesForGender,
  getProductsByGender,
  type SortOption,
} from "@/lib/queries/products";

const SORT_VALUES: SortOption[] = ["nouveautes", "prix-asc", "prix-desc", "popularite"];

export const metadata: Metadata = {
  title: "Collection Femme",
  description:
    "Bagues, colliers, bracelets et boucles d'oreilles façonnés à Djerba — la collection femme de Yuba Accessoires, pensée pour durer.",
};

export default async function FemmePage({
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
    getCategoriesForGender("femme"),
    getProductsByGender({
      gender: "femme",
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
        title="Femme"
        subtitle="Bijoux et accessoires façonnés à Djerba, pensés pour durer."
        image="/images/femme-visage-bijoux.jpg"
      />
      <EditorialZoomSection
        image="/images/femme-portrait-colliers.jpg"
        caption="Le détail d'abord."
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
