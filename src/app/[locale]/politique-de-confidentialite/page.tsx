import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "Collecte des données",
    body: "[À COMPLÉTER : liste des données collectées — nom, téléphone, adresse de livraison, email — et dans quel contexte (commande, création de compte, newsletter)]",
  },
  {
    title: "Utilisation des données",
    body: "[À COMPLÉTER : finalités du traitement — traitement des commandes, contact client, envoi d'offres si consentement]",
  },
  {
    title: "Conservation des données",
    body: "[À COMPLÉTER : durée de conservation des données clients et commandes]",
  },
  {
    title: "Cookies",
    body: "[À COMPLÉTER : cookies utilisés sur le site — session, panier, mesure d'audience éventuelle]",
  },
  {
    title: "Droits des utilisateurs",
    body: "[À COMPLÉTER : modalités d'accès, de rectification et de suppression des données personnelles]",
  },
  {
    title: "Contact",
    body: "[À COMPLÉTER : adresse email ou postale à contacter pour toute question relative aux données personnelles]",
  },
];

export default async function PrivacyPolicyPage({
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
          Politique de confidentialité
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
