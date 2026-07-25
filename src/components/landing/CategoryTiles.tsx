import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { LandingCategory } from "@/lib/queries/landing";

export function CategoryTiles({
  categories,
}: {
  categories: LandingCategory[];
}) {
  return (
    <section className="px-6 py-24 sm:px-10 lg:py-32">
      <h2 className="mb-12 font-serif text-4xl text-ink italic sm:text-5xl">
        Catégories
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/boutique/${category.slug}`}
            className="group relative block aspect-[4/5] overflow-hidden"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-ink/35 transition-colors duration-700 group-hover:bg-ink/50" />
            <p className="absolute inset-x-0 bottom-4 text-center font-sans text-xs tracking-[0.2em] text-cream uppercase">
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
