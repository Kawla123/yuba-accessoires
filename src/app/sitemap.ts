import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllActiveCategories, getAllProductSlugs } from "@/lib/queries/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuba-bijoux.com";

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/femme", priority: 0.9, changeFrequency: "daily" },
  { path: "/homme", priority: 0.9, changeFrequency: "daily" },
  { path: "/boutique", priority: 0.9, changeFrequency: "daily" },
  { path: "/atelier", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
  { path: "/livraison-et-retours", priority: 0.4, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/politique-de-confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getAllActiveCategories(),
    getAllProductSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const { path, priority, changeFrequency } of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency,
        priority,
      });
    }

    for (const category of categories) {
      entries.push({
        url: `${SITE_URL}/${locale}/boutique/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/produit/${product.slug}`,
        lastModified: product.createdAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
