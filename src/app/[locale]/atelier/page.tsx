import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Yuba Accessoires est né à Houmt Souk, Djerba — l'élégance de l'acier inoxydable et l'héritage des accessoires traditionnels djerbiens.",
};

export default async function WorkshopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <p className="text-center font-sans text-xs tracking-[0.2em] text-gold uppercase">
          Yuba
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl text-ink sm:text-5xl">
          Notre histoire
        </h1>

        <p className="mt-10 font-serif text-2xl leading-relaxed text-ink italic sm:text-3xl">
          Yuba Accessoires est né à Houmt Souk, au cœur de Djerba.
        </p>

        <p className="mt-8 font-sans text-base leading-relaxed text-charcoal/80">
          Notre boutique réunit deux mondes&nbsp;: l&rsquo;élégance
          intemporelle de l&rsquo;acier inoxydable et l&rsquo;héritage des
          accessoires traditionnels djerbiens. Sacs, montres, lunettes,
          portefeuilles, bijoux — chaque pièce est choisie pour durer, pour
          homme comme pour femme, entre racines et modernité.
        </p>

        <div className="mt-16 flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-cream-2 text-charcoal/40">
          <ImageIcon className="h-8 w-8" />
          <p className="font-sans text-xs uppercase tracking-wide">
            Photo de la boutique à ajouter
          </p>
        </div>
      </div>
    </main>
  );
}
