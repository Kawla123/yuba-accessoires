import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTND } from "@/lib/format";
import { OrdersFilterBar } from "@/components/admin/OrdersFilterBar";
import { QuickStatusMenu } from "@/components/admin/QuickStatusMenu";
import { ORDER_STATUS_VALUES } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/database.types";

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  failed: "Échouée",
  refunded: "Remboursée",
};

const SORTABLE_COLUMNS = ["created_at", "total", "customer_name"] as const;
type SortColumn = (typeof SORTABLE_COLUMNS)[number];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    statut?: string;
    q?: string;
    tri?: string;
    dir?: string;
  }>;
}) {
  const { statut, q, tri, dir } = await searchParams;

  const sortColumn: SortColumn = SORTABLE_COLUMNS.includes(tri as SortColumn)
    ? (tri as SortColumn)
    : "created_at";
  const ascending = dir === "asc";

  const supabase = createAdminClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, created_at, total, payment_method, payment_status, order_status",
    )
    .order(sortColumn, { ascending });

  if (statut && ORDER_STATUS_VALUES.includes(statut as OrderStatus)) {
    query = query.eq("order_status", statut as OrderStatus);
  }
  if (q) {
    query = query.or(`customer_name.ilike.%${q}%,order_number.ilike.%${q}%`);
  }

  const { data: orders, error } = await query;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <h1 className="font-serif text-3xl text-ink">Commandes</h1>

      <div className="mt-6">
        <OrdersFilterBar statut={statut} q={q} />
      </div>

      {error ? (
        <p className="mt-8 font-sans text-sm text-red-700">
          Impossible de charger les commandes : {error.message}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto border border-border bg-cream">
        <table className="w-full min-w-[720px] border-collapse font-sans text-sm">
          <thead>
            <tr className="border-b border-border bg-cream-2 text-left text-charcoal/60">
              <th className="px-4 py-3">N°</th>
              <SortableHeader
                column="customer_name"
                label="Client"
                activeSort={sortColumn}
                ascending={ascending}
                statut={statut}
                q={q}
              />
              <SortableHeader
                column="created_at"
                label="Date"
                activeSort={sortColumn}
                ascending={ascending}
                statut={statut}
                q={q}
              />
              <SortableHeader
                column="total"
                label="Total"
                activeSort={sortColumn}
                ascending={ascending}
                statut={statut}
                q={q}
              />
              <th className="px-4 py-3">Paiement</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((order) => (
              <tr key={order.id} className="border-b border-border last:border-b-0 hover:bg-cream-2/60">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="text-ink hover:text-gold"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3 text-charcoal/70">
                  {new Date(order.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">{formatTND(order.total)}</td>
                <td className="px-4 py-3 text-charcoal/70">
                  {order.payment_method === "cod" ? "Livraison" : "Konnect"} ·{" "}
                  {PAYMENT_STATUS_LABELS[order.payment_status]}
                </td>
                <td className="px-4 py-3">
                  <QuickStatusMenu orderId={order.id} status={order.order_status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(orders ?? []).length === 0 ? (
          <p className="px-4 py-8 font-sans text-sm text-charcoal/60">
            Aucune commande pour ces critères.
          </p>
        ) : null}
      </div>
    </main>
  );
}

function SortableHeader({
  column,
  label,
  activeSort,
  ascending,
  statut,
  q,
}: {
  column: SortColumn;
  label: string;
  activeSort: SortColumn;
  ascending: boolean;
  statut?: string;
  q?: string;
}) {
  const isActive = activeSort === column;
  const nextDir = isActive && ascending ? "desc" : "asc";
  const params = new URLSearchParams();
  if (statut) params.set("statut", statut);
  if (q) params.set("q", q);
  params.set("tri", column);
  params.set("dir", nextDir);

  return (
    <th className="px-4 py-3">
      <Link href={`/admin/commandes?${params.toString()}`} className="hover:text-gold">
        {label} {isActive ? (ascending ? "↑" : "↓") : ""}
      </Link>
    </th>
  );
}
