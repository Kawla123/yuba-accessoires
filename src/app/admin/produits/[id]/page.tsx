import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicUrl } from "@/lib/supabase/storage";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name_fr, slug, price_tnd, category_id, gender, stock_quantity, is_active, is_featured, is_new, product_images(r2_key, position)",
      )
      .eq("id", id)
      .maybeSingle<{
        id: string;
        name_fr: string;
        slug: string;
        price_tnd: number;
        category_id: string | null;
        gender: "femme" | "homme" | "mixte";
        stock_quantity: number;
        is_active: boolean;
        is_featured: boolean;
        is_new: boolean;
        product_images: { r2_key: string; position: number }[] | null;
      }>(),
    supabase.from("categories").select("id, name_fr").order("position"),
  ]);

  if (!product) {
    notFound();
  }

  const images = [...(product.product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((img) => ({ path: img.r2_key, url: getPublicUrl(img.r2_key) }));

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl text-ink">{product.name_fr}</h1>
      <ProductForm
        categories={categories ?? []}
        initial={{
          nameFr: product.name_fr,
          slug: product.slug,
          priceTnd: product.price_tnd,
          categoryId: product.category_id,
          gender: product.gender,
          stockQuantity: product.stock_quantity,
          isActive: product.is_active,
          isFeatured: product.is_featured,
          isNew: product.is_new,
          images,
        }}
        action={boundUpdate}
      />
    </main>
  );
}
