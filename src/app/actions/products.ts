"use server";

import { getProductDetailBySlug, type ShopProductDetail } from "@/lib/queries/products";

export async function fetchQuickViewProduct(slug: string): Promise<ShopProductDetail | null> {
  return getProductDetailBySlug(slug);
}
