import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CursorSheen } from "@/components/CursorSheen";

const items = [
  {
    title: "Collection Femme",
    href: "/femme",
    image: "/images/collection-femme.jpg",
  },
  {
    title: "Collection Homme",
    href: "/homme",
    image: "/images/collection-homme.jpg",
  },
] as const;

export function Collections() {
  return (
    <section id="collections" className="grid md:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group relative block min-h-[100dvh] overflow-hidden"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-ink/30 transition-colors duration-700 group-hover:bg-ink/55" />

          <CursorSheen />

          <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-4 px-6 text-center">
            <h2 className="font-serif text-4xl text-cream italic sm:text-5xl">
              {item.title}
            </h2>
            <span className="font-sans text-xs tracking-[0.3em] text-gold uppercase">
              Découvrir
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
