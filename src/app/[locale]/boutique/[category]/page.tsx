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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categories = await getAllActiveCategories();
  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;

  return {
    title: categoryName,
    description: `Découvrez la collection ${categoryName} de Yuba Accessoires, façonnée à Djerba.`,
  };
}

export default async function BoutiqueCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{
    tri?: string;
    prixMin?: string;
    prixMax?: string;
    stock?: string;
  }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const sort: SortOption = SORT_VALUES.includes(sp.tri as SortOption)
    ? (sp.tri as SortOption)
    : "nouveautes";

  const [categories, { products, total }] = await Promise.all([
    getAllActiveCategories(),
    getProductsByGender({
      categorySlug: category,
      sort,
      priceMinTnd: sp.prixMin ? Number(sp.prixMin) : undefined,
      priceMaxTnd: sp.prixMax ? Number(sp.prixMax) : undefined,
      inStockOnly: sp.stock === "1",
    }),
  ]);

  const categoryName = categories.find((c) => c.slug === category)?.name ?? category;

  return (
    <main className="flex-1">
      <CollectionHero
        title={categoryName}
        subtitle="Découvrez toute la collection Yuba Accessoires — bijoux, sacs, montres, lunettes et accessoires traditionnels djerbiens, pour homme et femme."
        image="/images/collection-homme.jpg"
      />
      {/* Pas de chips catégorie ici : la catégorie est déjà fixée par
          l'URL. Le bouton "Tout" du composant partagé ne pourrait pas la
          réinitialiser proprement sur une route dédiée à une catégorie. */}
      <CollectionToolbar total={total} categories={[]} sort={sort} />
      <ProductGrid products={products} />
      <QuickViewModal />
    </main>
  );
}
