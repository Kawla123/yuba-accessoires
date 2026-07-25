import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import { placeholder } from "@/lib/placeholder";
import { demoCategories, demoProducts, type DemoProduct } from "@/data/demo";

// Photos de démonstration (voir public/images/) utilisées tant que le
// catalogue Supabase est vide pour ce genre — un bien meilleur repli que
// des dégradés/placeholder sans rapport.
const DEMO_IMAGES = [
  "/images/femme-bagues-noir.jpg",
  "/images/femme-colliers-bagues.jpg",
  "/images/femme-bracelet-perles.jpg",
  "/images/femme-visage-bijoux.jpg",
  "/images/femme-portrait-colliers.jpg",
  "/images/femme-bagues-jean.jpg",
  "/images/montre-produit.jpg",
  "/images/collier-diamant.jpg",
];

export type Gender = "femme" | "homme";
export type SortOption = "nouveautes" | "prix-asc" | "prix-desc" | "popularite";

export type ShopCategory = { slug: string; name: string };

export type ShopProduct = {
  slug: string;
  name: string;
  categoryName: string;
  priceTnd: number;
  compareAtPriceTnd: number | null;
  images: string[];
  isNew: boolean;
  inStock: boolean;
  hasVariants: boolean;
};

export type ShopProductDetail = ShopProduct & {
  descriptionFr: string | null;
  variants: { id: string; name: string; priceDelta: number; stockQuantity: number }[];
};

export type ProductListFilters = {
  gender?: Gender;
  categorySlug?: string;
  sort?: SortOption;
  priceMinTnd?: number;
  priceMaxTnd?: number;
  inStockOnly?: boolean;
};

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function demoProductToShop(p: DemoProduct, i: number): ShopProduct {
  const category = demoCategories.find((c) => c.slug === p.categorySlug);
  return {
    slug: p.slug,
    name: p.name,
    categoryName: category?.name ?? p.categorySlug,
    priceTnd: p.priceTnd,
    compareAtPriceTnd: p.compareAtPriceTnd ?? null,
    images: [DEMO_IMAGES[i % DEMO_IMAGES.length]],
    isNew: Boolean(p.isNew),
    inStock: true,
    hasVariants: false,
  };
}

function demoFallbackList(filters: ProductListFilters): { products: ShopProduct[]; total: number } {
  let list = demoProducts.map(demoProductToShop);

  if (filters.categorySlug) {
    list = list.filter((_, i) => demoProducts[i].categorySlug === filters.categorySlug);
  }
  if (filters.inStockOnly) {
    list = list.filter((p) => p.inStock);
  }
  if (filters.priceMinTnd !== undefined) {
    list = list.filter((p) => p.priceTnd >= filters.priceMinTnd! * 100);
  }
  if (filters.priceMaxTnd !== undefined) {
    list = list.filter((p) => p.priceTnd <= filters.priceMaxTnd! * 100);
  }

  switch (filters.sort) {
    case "prix-asc":
      list = [...list].sort((a, b) => a.priceTnd - b.priceTnd);
      break;
    case "prix-desc":
      list = [...list].sort((a, b) => b.priceTnd - a.priceTnd);
      break;
    default:
      break;
  }

  return { products: list, total: list.length };
}

export async function getCategoriesForGender(gender: Gender): Promise<ShopCategory[]> {
  if (!isSupabaseConfigured()) {
    return demoCategories.map((c) => ({ slug: c.slug, name: c.name }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("categories!inner(slug, name_fr)")
      .eq("is_active", true)
      .in("gender", [gender, "mixte"])
      .returns<{ categories: { slug: string; name_fr: string } }[]>();

    if (error || !data || data.length === 0) {
      throw error ?? new Error("aucune catégorie");
    }

    const seen = new Map<string, ShopCategory>();
    for (const row of data) {
      if (!seen.has(row.categories.slug)) {
        seen.set(row.categories.slug, { slug: row.categories.slug, name: row.categories.name_fr });
      }
    }
    return Array.from(seen.values());
  } catch {
    return demoCategories.map((c) => ({ slug: c.slug, name: c.name }));
  }
}

// Pour le sitemap : liste légère de tous les slugs produits actifs, sans
// repli démo (un sitemap ne doit référencer que de vraies pages).
export async function getAllProductSlugs(): Promise<{ slug: string; createdAt: string }[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug, created_at")
      .eq("is_active", true)
      .returns<{ slug: string; created_at: string }[]>();

    if (error || !data) return [];
    return data.map((p) => ({ slug: p.slug, createdAt: p.created_at }));
  } catch {
    return [];
  }
}

export async function getAllActiveCategories(): Promise<ShopCategory[]> {
  if (!isSupabaseConfigured()) {
    return demoCategories.map((c) => ({ slug: c.slug, name: c.name }));
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name_fr")
      .eq("is_active", true)
      .order("position")
      .returns<{ slug: string; name_fr: string }[]>();

    if (error || !data || data.length === 0) {
      throw error ?? new Error("aucune catégorie");
    }

    return data.map((c) => ({ slug: c.slug, name: c.name_fr }));
  } catch {
    return demoCategories.map((c) => ({ slug: c.slug, name: c.name }));
  }
}

type ProductListRow = {
  slug: string;
  name_fr: string;
  price_tnd: number;
  compare_at_price_tnd: number | null;
  is_new: boolean;
  stock_quantity: number;
  categories: { name_fr: string } | null;
  product_images: { r2_key: string; position: number }[] | null;
  product_variants: { id: string }[] | null;
};

export async function getProductsByGender(
  filters: ProductListFilters,
): Promise<{ products: ShopProduct[]; total: number }> {
  if (!isSupabaseConfigured()) {
    return demoFallbackList(filters);
  }

  try {
    const supabase = await createClient();

    let categoryId: string | undefined;
    if (filters.categorySlug) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", filters.categorySlug)
        .maybeSingle<{ id: string }>();
      // Slug de catégorie inconnu : ne doit renvoyer aucun produit plutôt
      // que d'ignorer silencieusement le filtre.
      if (!category) return { products: [], total: 0 };
      categoryId = category.id;
    }

    let query = supabase
      .from("products")
      .select(
        "slug, name_fr, price_tnd, compare_at_price_tnd, is_new, stock_quantity, categories(name_fr), product_images(r2_key, position), product_variants(id)",
        { count: "exact" },
      )
      .eq("is_active", true);

    if (filters.gender) {
      query = query.in("gender", [filters.gender, "mixte"]);
    }
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (filters.inStockOnly) {
      query = query.gt("stock_quantity", 0);
    }
    if (filters.priceMinTnd !== undefined) {
      query = query.gte("price_tnd", filters.priceMinTnd * 100);
    }
    if (filters.priceMaxTnd !== undefined) {
      query = query.lte("price_tnd", filters.priceMaxTnd * 100);
    }

    switch (filters.sort) {
      case "prix-asc":
        query = query.order("price_tnd", { ascending: true });
        break;
      case "prix-desc":
        query = query.order("price_tnd", { ascending: false });
        break;
      case "popularite":
        query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    const { data, error, count } = await query.returns<ProductListRow[]>();

    if (error || !data || data.length === 0) {
      throw error ?? new Error("aucun produit");
    }

    const products: ShopProduct[] = data.map((p) => {
      const images = [...(p.product_images ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((img) => getPublicUrl(img.r2_key));
      return {
        slug: p.slug,
        name: p.name_fr,
        categoryName: p.categories?.name_fr ?? "",
        priceTnd: p.price_tnd,
        compareAtPriceTnd: p.compare_at_price_tnd,
        images: images.length > 0 ? images : [placeholder(p.slug, 900, 1100)],
        isNew: p.is_new,
        inStock: p.stock_quantity > 0,
        hasVariants: (p.product_variants ?? []).length > 0,
      };
    });

    return { products, total: count ?? products.length };
  } catch {
    return demoFallbackList(filters);
  }
}

type ProductDetailRow = {
  slug: string;
  name_fr: string;
  description_fr: string | null;
  price_tnd: number;
  compare_at_price_tnd: number | null;
  is_new: boolean;
  stock_quantity: number;
  categories: { name_fr: string } | null;
  product_images: { r2_key: string; position: number }[] | null;
  product_variants:
    | { id: string; name: string; price_delta: number; stock_quantity: number }[]
    | null;
};

export async function getProductDetailBySlug(slug: string): Promise<ShopProductDetail | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          "slug, name_fr, description_fr, price_tnd, compare_at_price_tnd, is_new, stock_quantity, categories(name_fr), product_images(r2_key, position), product_variants(id, name, price_delta, stock_quantity)",
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle<ProductDetailRow>();

      if (error) throw error;

      if (data) {
        const images = [...(data.product_images ?? [])]
          .sort((a, b) => a.position - b.position)
          .map((img) => getPublicUrl(img.r2_key));
        return {
          slug: data.slug,
          name: data.name_fr,
          descriptionFr: data.description_fr,
          categoryName: data.categories?.name_fr ?? "",
          priceTnd: data.price_tnd,
          compareAtPriceTnd: data.compare_at_price_tnd,
          images: images.length > 0 ? images : [placeholder(data.slug, 900, 1100)],
          isNew: data.is_new,
          inStock: data.stock_quantity > 0,
          hasVariants: (data.product_variants ?? []).length > 0,
          variants: (data.product_variants ?? []).map((v) => ({
            id: v.id,
            name: v.name,
            priceDelta: v.price_delta,
            stockQuantity: v.stock_quantity,
          })),
        };
      }
    } catch {
      // tombe sur le repli démo ci-dessous
    }
  }

  const demoIndex = demoProducts.findIndex((p) => p.slug === slug);
  if (demoIndex === -1) return null;
  const demo = demoProducts[demoIndex];
  return {
    ...demoProductToShop(demo, demoIndex),
    descriptionFr: null,
    variants: [],
  };
}
