import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTND } from "@/lib/format";
import { AdminStatusChanger } from "@/components/admin/AdminStatusChanger";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import type { OrderStatus } from "@/types/database.types";

type AdminOrderDetail = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  governorate: string;
  payment_method: "cod" | "konnect";
  payment_status: string;
  order_status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  konnect_payment_ref: string | null;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    unit_price_at_purchase: number;
    product_name_snapshot: string;
  }[];
};

type HistoryRow = { status: OrderStatus; created_at: string };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: order }, { data: history }] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, customer_phone, customer_email, shipping_address, city, governorate, payment_method, payment_status, order_status, subtotal, shipping_cost, total, konnect_payment_ref, created_at, order_items(id, quantity, unit_price_at_purchase, product_name_snapshot)",
      )
      .eq("id", id)
      .maybeSingle<AdminOrderDetail>(),
    supabase
      .from("order_status_history")
      .select("status, created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: true })
      .returns<HistoryRow[]>(),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">
            Commande {order.order_number}
          </h1>
          <p className="mt-1 font-sans text-sm text-charcoal/60">
            {new Date(order.created_at).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <AdminStatusChanger orderId={order.id} currentStatus={order.order_status} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
              Articles
            </h2>
            <ul className="mt-3 divide-y divide-border border-t border-b border-border">
              {order.order_items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-3 font-sans text-sm"
                >
                  <span>
                    {item.product_name_snapshot} × {item.quantity}
                  </span>
                  <span>{formatTND(item.unit_price_at_purchase * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-sans text-sm text-charcoal/70">Total</span>
              <span className="font-serif text-xl text-ink">
                {formatTND(order.total)}
              </span>
            </div>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
              Historique de statut
            </h2>
            <ul className="mt-3 space-y-3">
              {(history ?? []).map((entry, i) => (
                <li key={i} className="flex items-center gap-3">
                  <OrderStatusBadge status={entry.status} />
                  <span className="font-sans text-xs text-charcoal/50">
                    {new Date(entry.created_at).toLocaleString("fr-FR")}
                  </span>
                </li>
              ))}
              {(history ?? []).length === 0 ? (
                <li className="font-sans text-xs text-charcoal/50">
                  Aucun historique enregistré.
                </li>
              ) : null}
            </ul>
          </section>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
              Client
            </h2>
            <p className="mt-2 font-sans text-sm text-ink">{order.customer_name}</p>
            <p className="font-sans text-sm text-ink">{order.customer_phone}</p>
            {order.customer_email ? (
              <p className="font-sans text-sm text-ink">{order.customer_email}</p>
            ) : null}
            <p className="mt-2 font-sans text-sm text-charcoal/70">
              {order.shipping_address}, {order.city}, {order.governorate}
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
              Paiement
            </h2>
            <p className="mt-2 font-sans text-sm text-ink">
              {order.payment_method === "cod" ? "À la livraison" : "En ligne (Konnect)"}
            </p>
            <p className="font-sans text-sm text-charcoal/70">
              Statut paiement : {order.payment_status}
            </p>
            {order.konnect_payment_ref ? (
              <p className="font-sans text-xs text-charcoal/50">
                Réf. Konnect : {order.konnect_payment_ref}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
