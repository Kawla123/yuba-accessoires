"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { productFormSchema } from "@/lib/validation/product";

function parseFormData(formData: FormData) {
  let images: unknown = [];
  try {
    images = JSON.parse(String(formData.get("images") ?? "[]"));
  } catch {
    images = [];
  }

  return productFormSchema.safeParse({
    nameFr: formData.get("nameFr"),
    slug: formData.get("slug"),
    priceTnd: formData.get("priceTnd"),
    categoryId: formData.get("categoryId") || null,
    gender: formData.get("gender"),
    stockQuantity: formData.get("stockQuantity"),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isNew: formData.get("isNew") === "on",
    images,
  });
}

async function replaceProductImages(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string,
  images: string[],
) {
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images.length > 0) {
    await supabase.from("product_images").insert(
      images.map((r2_key, position) => ({
        product_id: productId,
        r2_key,
        position,
      })),
    );
  }
}

export async function createProduct(formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name_fr: parsed.data.nameFr,
      slug: parsed.data.slug,
      price_tnd: parsed.data.priceTnd,
      category_id: parsed.data.categoryId,
      gender: parsed.data.gender,
      stock_quantity: parsed.data.stockQuantity,
      is_active: parsed.data.isActive,
      is_featured: parsed.data.isFeatured,
      is_new: parsed.data.isNew,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Échec de création." };
  }

  await replaceProductImages(supabase, data.id, parsed.data.images);

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function updateProduct(productId: string, formData: FormData) {
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name_fr: parsed.data.nameFr,
      slug: parsed.data.slug,
      price_tnd: parsed.data.priceTnd,
      category_id: parsed.data.categoryId,
      gender: parsed.data.gender,
      stock_quantity: parsed.data.stockQuantity,
      is_active: parsed.data.isActive,
      is_featured: parsed.data.isFeatured,
      is_new: parsed.data.isNew,
    })
    .eq("id", productId);

  if (error) {
    return { ok: false, error: error.message };
  }

  await replaceProductImages(supabase, productId, parsed.data.images);

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${productId}`);
  return { ok: true };
}
