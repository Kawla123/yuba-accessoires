import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { LandingProduct } from "@/lib/queries/landing";

export function BestSellers({ products }: { products: LandingProduct[] }) {
  const items = products.slice(0, 4);

  return (
    <section className="py-24 lg:py-32">
      <h2 className="mb-12 px-6 font-serif text-4xl text-ink italic sm:px-10 sm:text-5xl">
        Meilleures ventes
      </h2>

      <div className="grid grid-cols-2 gap-4 px-6 sm:px-10 lg:grid-cols-4">
        {items.map((product) => (
          <Link
            key={product.slug}
            href={`/produit/${product.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 24vw, 45vw"
              className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
