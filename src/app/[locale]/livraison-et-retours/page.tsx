import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Livraison et retours",
  description:
    "Livraison partout en Tunisie sous 3 à 4 jours (7 DT), retrait gratuit en boutique à Djerba, retours acceptés sous 7 jours.",
};

export default async function ShippingReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10">
        <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
          Yuba
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Livraison et retours
        </h1>

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-gold italic">Livraison</h2>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-charcoal/80">
            Livraison partout en Tunisie sous 3 à 4 jours maximum, au tarif de
            7&nbsp;DT. Retrait gratuit possible directement en boutique à
            Houmt Souk, Djerba (à côté de Meuble Aroua).
          </p>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl text-gold italic">Retours</h2>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-charcoal/80">
            Retours acceptés sous 7 jours après réception, pour un article non
            porté et dans son emballage d&rsquo;origine. Le retour se fait
            soit en boutique, soit par envoi à vos frais.
          </p>
        </div>
      </div>
    </main>
  );
}
