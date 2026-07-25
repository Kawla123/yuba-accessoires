import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "Éditeur du site",
    body: "[À COMPLÉTER : nom légal de l'entreprise, forme juridique, adresse du siège, numéro d'immatriculation (registre du commerce), directeur de la publication]",
  },
  {
    title: "Hébergement",
    body: "[À COMPLÉTER : nom et adresse de l'hébergeur du site]",
  },
  {
    title: "Propriété intellectuelle",
    body: "[À COMPLÉTER : mention sur les droits d'auteur relatifs aux textes, photos et éléments graphiques du site]",
  },
  {
    title: "Données personnelles",
    body: "[À COMPLÉTER : renvoi vers la politique de confidentialité et rappel des droits des utilisateurs]",
  },
  {
    title: "Droit applicable",
    body: "[À COMPLÉTER : droit applicable et juridiction compétente en cas de litige]",
  },
];

export default async function LegalNoticePage({
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
          Mentions légales
        </h1>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title} className="border-t border-border pt-6">
              <h2 className="font-serif text-xl text-ink">{section.title}</h2>
              <p className="mt-2 max-w-xl font-sans text-sm text-charcoal/60 italic">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
