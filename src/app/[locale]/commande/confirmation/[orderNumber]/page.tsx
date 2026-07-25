import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getOrderByNumber } from "@/lib/queries/orders";
import { formatTND } from "@/lib/format";
import { ClearCartOnMount } from "@/components/checkout/ClearCartOnMount";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  robots: { index: false, follow: false },
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Paiement à la livraison",
  konnect: "Payé en ligne (Konnect)",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "en attente de confirmation",
  confirmed: "confirmée",
  shipped: "expédiée",
  delivered: "livrée",
  cancelled: "annulée",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
}) {
  const { locale, orderNumber } = await params;
  setRequestLocale(locale);

  const order = await getOrderByNumber(orderNumber);
  if (!order) {
    notFound();
  }

  return (
    <main className="flex-1">
      <ClearCartOnMount />
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
          Merci !
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink">
          Commande {order.order_number}
        </h1>
        <p className="mt-2 font-sans text-sm text-charcoal/70">
          Statut : {ORDER_STATUS_LABELS[order.order_status] ?? order.order_status}
          {" · "}
          {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
        </p>

        <ul className="mt-8 divide-y divide-border border-t border-b border-border">
          {order.order_items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3 font-sans text-sm"
            >
              <span>
                {item.product_name_snapshot} × {item.quantity}
              </span>
              <span>
                {formatTND(item.unit_price_at_purchase * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between">
          <span className="font-sans text-sm text-charcoal/70">Total</span>
          <span className="font-serif text-2xl text-ink">
            {formatTND(order.total)}
          </span>
        </div>

        <div className="mt-6 font-sans text-sm text-charcoal/70">
          <p>Livraison à : {order.shipping_address}, {order.city}, {order.governorate}</p>
          <p className="mt-1">Contact : {order.customer_phone}</p>
        </div>

        {order.payment_method === "cod" ? (
          <p className="mt-6 font-sans text-sm text-charcoal/70">
            Nous t&rsquo;appellerons ou t&rsquo;enverrons un SMS pour confirmer
            la commande avant expédition.
          </p>
        ) : null}

        <Link
          href="/boutique"
          className="mt-10 inline-block bg-ink px-6 py-3 font-sans text-sm text-cream hover:bg-gold"
        >
          Continuer mes achats
        </Link>
      </div>
    </main>
  );
}
