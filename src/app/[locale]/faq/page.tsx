import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Livraison, retrait en boutique, entretien, paiement et retours — les réponses aux questions les plus fréquentes sur Yuba Accessoires.",
};

const FAQ_ITEMS = [
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "Nous livrons partout en Tunisie sous 3 à 4 jours maximum, au tarif de 7 DT. Tu peux aussi retirer ta commande gratuitement en boutique à Houmt Souk, Djerba.",
  },
  {
    question: "Puis-je récupérer ma commande en boutique ?",
    answer:
      "Oui, le retrait en boutique est gratuit. Rendez-vous à Houmt Souk, Djerba, à côté de Meuble Aroua.",
  },
  {
    question: "Comment entretenir mes bijoux en acier inoxydable ?",
    answer:
      "L'acier inoxydable résiste très bien à l'eau et à la transpiration au quotidien. Pour qu'il garde tout son éclat, essuie-le simplement avec un chiffon doux et évite les parfums ou produits abrasifs appliqués directement dessus.",
  },
  {
    question: "Quels sont les modes de paiement acceptés ?",
    answer:
      "Le paiement à la livraison est notre mode par défaut, disponible dès maintenant partout en Tunisie. Le paiement en ligne par carte arrive bientôt.",
  },
  {
    question: "Puis-je échanger ou retourner un article ?",
    answer:
      "Oui, les retours sont acceptés sous 7 jours après réception, pour un article non porté et dans son emballage d'origine. Le retour se fait en boutique ou par envoi à tes frais.",
  },
  {
    question: "Livrez-vous en dehors de la Tunisie ?",
    answer: "Pas encore, pour le moment.",
  },
];

export default async function FaqPage({
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
        <h1 className="mt-3 mb-12 font-serif text-4xl text-ink sm:text-5xl">
          Questions fréquentes
        </h1>

        <FaqAccordion items={FAQ_ITEMS} />
      </div>
    </main>
  );
}
