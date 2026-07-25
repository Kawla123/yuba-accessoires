import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTND } from "@/lib/format";

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name_fr, price_tnd, gender, is_active, stock_quantity")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="bg-ink px-5 py-2.5 font-sans text-sm text-cream transition-colors hover:bg-gold hover:text-ink"
        >
          Nouveau produit
        </Link>
      </div>

      {error ? (
        <p className="mt-8 font-sans text-sm text-red-700">
          Impossible de charger les produits : {error.message}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto border border-border bg-cream">
        <table className="w-full min-w-[640px] border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-2 text-left text-charcoal/60">
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Genre</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr key={product.id} className="border-b border-border last:border-b-0 hover:bg-cream-2/60">
                <td className="px-4 py-3 text-ink">{product.name_fr}</td>
                <td className="px-4 py-3 text-charcoal/70 capitalize">{product.gender}</td>
                <td className="px-4 py-3">{formatTND(product.price_tnd)}</td>
                <td className="px-4 py-3">
                  {product.stock_quantity === 0 ? (
                    <span className="bg-charcoal/10 px-2.5 py-1 font-sans text-xs text-charcoal/70">
                      Rupture
                    </span>
                  ) : (
                    product.stock_quantity
                  )}
                </td>
                <td className="px-4 py-3 text-charcoal/70">
                  {product.is_active ? "Actif" : "Inactif"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/produits/${product.id}`}
                    className="text-ink hover:text-gold"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(products ?? []).length === 0 ? (
          <p className="px-4 py-8 font-sans text-sm text-charcoal/60">
            Aucun produit pour l&rsquo;instant.
          </p>
        ) : null}
      </div>
    </main>
  );
}
