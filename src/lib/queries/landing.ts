import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getPublicUrl } from "@/lib/supabase/storage";
import { formatTND } from "@/lib/format";
import { placeholder } from "@/lib/placeholder";
import { demoProducts, demoCategories } from "@/data/demo";

// Photos réelles (déposées par l'utilisateur, voir public/images/) utilisées
// tant que le catalogue n'a pas encore de vrais produits/catégories en base :
// un bien meilleur repli que des photos aléatoires sans rapport (picsum).
const DEMO_PRODUCT_IMAGES = [
  "/images/femme-bagues-noir.jpg",
  "/images/femme-colliers-bagues.jpg",
  "/images/femme-bracelet-perles.jpg",
  "/images/femme-visage-bijoux.jpg",
  "/images/femme-portrait-colliers.jpg",
  "/images/femme-bagues-jean.jpg",
  "/images/montre-produit.jpg",
  "/images/collier-diamant.jpg",
];

// Ordre calé sur demoCategories (bagues, colliers, boucles-doreilles,
// bracelets, montres) pour que chaque vignette montre le bon type de bijou.
const DEMO_CATEGORY_IMAGES = [
  "/images/femme-bagues-noir.jpg",
  "/images/femme-colliers-bagues.jpg",
  "/images/femme-visage-bijoux.jpg",
  "/images/femme-bracelet-perles.jpg",
  "/images/montre-portrait.jpg",
];

export type LandingProduct = {
  slug: string;
  name: string;
  priceLabel: string;
  image: string;
};

export type LandingCategory = {
  slug: string;
  name: string;
  image: string;
};

type ProductImageRow = { r2_key: string; position: number };
type ProductRow = {
  slug: string;
  name_fr: string;
  price_tnd: number;
  product_images: ProductImageRow[] | null;
};
type CategoryRow = {
  slug: string;
  name_fr: string;
  image_r2_key: string | null;
};

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function demoProductsFallback(
  key: "isNew" | "isFeatured",
  limit: number,
): LandingProduct[] {
  return demoProducts
    .filter((p) => p[key])
    .slice(0, limit)
    .map((p, i) => ({
      slug: p.slug,
      name: p.name,
      priceLabel: formatTND(p.priceTnd),
      image: DEMO_PRODUCT_IMAGES[i % DEMO_PRODUCT_IMAGES.length],
    }));
}

// Le catalogue n'a pas encore de produits réels (aucune migration de seed
// pour `products` : voir supabase/migrations/0003_products.sql) — tant que
// la requête ne renvoie rien (ou que Supabase n'est pas configuré), on
// retombe sur les données de démonstration plutôt que d'afficher une
// section vide.
async function fetchProducts(
  column: "is_new" | "is_featured",
  demoKey: "isNew" | "isFeatured",
  limit: number,
): Promise<LandingProduct[]> {
  if (!isSupabaseConfigured()) {
    return demoProductsFallback(demoKey, limit);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("slug, name_fr, price_tnd, product_images(r2_key, position)")
      .eq("is_active", true)
      .eq(column, true)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<ProductRow[]>();

    if (error || !data || data.length === 0) {
      throw error ?? new Error("no products yet");
    }

    return data.map((p) => {
      const images = [...(p.product_images ?? [])].sort(
        (a, b) => a.position - b.position,
      );
      const primary = images[0];
      return {
        slug: p.slug,
        name: p.name_fr,
        priceLabel: formatTND(p.price_tnd),
        image: primary
          ? getPublicUrl(primary.r2_key)
          : placeholder(p.slug, 900, 1100),
      };
    });
  } catch {
    return demoProductsFallback(demoKey, limit);
  }
}

export async function getNewArrivals(limit = 5): Promise<LandingProduct[]> {
  return fetchProducts("is_new", "isNew", limit);
}

export async function getBestSellers(limit = 5): Promise<LandingProduct[]> {
  return fetchProducts("is_featured", "isFeatured", limit);
}

export type LandingReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
};

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
};

// Pas de repli démo ici volontairement : tant qu'il n'y a pas de vrais
// avis approuvés, la section doit afficher un état vide assumé plutôt
// que des témoignages fictifs.
export async function getApprovedReviews(limit = 6): Promise<LandingReview[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<ReviewRow[]>();

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      rating: r.rating,
      comment: r.comment,
    }));
  } catch {
    return [];
  }
}

export async function getLandingCategories(
  limit = 5,
): Promise<LandingCategory[]> {
  const demoFallback = () =>
    demoCategories.slice(0, limit).map((c, i) => ({
      slug: c.slug,
      name: c.name,
      image: DEMO_CATEGORY_IMAGES[i % DEMO_CATEGORY_IMAGES.length],
    }));

  if (!isSupabaseConfigured()) {
    return demoFallback();
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("slug, name_fr, image_r2_key")
      .eq("is_active", true)
      .order("position")
      .limit(limit)
      .returns<CategoryRow[]>();

    if (error || !data || data.length === 0) {
      throw error ?? new Error("no active categories yet");
    }

    return data.map((c) => ({
      slug: c.slug,
      name: c.name_fr,
      image: c.image_r2_key
        ? getPublicUrl(c.image_r2_key)
        : placeholder(c.slug, 600, 750),
    }));
  } catch {
    return demoFallback();
  }
}
