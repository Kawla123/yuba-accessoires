import { createAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name_fr")
    .order("position");

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl text-ink">Nouveau produit</h1>
      <ProductForm categories={categories ?? []} action={createProduct} />
    </main>
  );
}
