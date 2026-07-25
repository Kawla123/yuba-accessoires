import { ProductCard } from "./ProductCard";
import { BreathingGridItem } from "./BreathingGridItem";
import type { ShopProduct } from "@/lib/queries/products";

export function ProductGrid({ products }: { products: ShopProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="px-6 py-16 text-center font-sans text-sm text-charcoal/60 sm:px-10">
        Aucun produit ne correspond à ces critères.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-16">
      {products.map((product, i) => (
        <BreathingGridItem key={product.slug} index={i}>
          <ProductCard product={product} />
        </BreathingGridItem>
      ))}
    </div>
  );
}
