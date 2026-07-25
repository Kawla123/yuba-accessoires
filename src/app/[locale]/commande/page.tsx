import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ paiement?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { paiement } = await searchParams;

  return (
    <main className="flex-1">
      <CheckoutFlow locale={locale} paymentFailed={paiement === "echec"} />
    </main>
  );
}
