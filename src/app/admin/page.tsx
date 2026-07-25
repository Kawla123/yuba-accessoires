import { ShoppingBag, Wallet, Clock, PackageX } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatTND } from "@/lib/format";
import { StatCard } from "@/components/admin/StatCard";

function pctDelta(current: number, previous: number): string {
  if (previous === 0) {
    return current === 0 ? "0% vs période précédente" : "vs période précédente (aucune donnée avant)";
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}% vs période précédente`;
}

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    { count: ordersToday },
    { count: ordersYesterday },
    { data: monthOrders },
    { data: lastMonthOrders },
    { count: pendingCount },
    { count: outOfStockCount },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterdayStart.toISOString())
      .lt("created_at", todayStart.toISOString()),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", monthStart.toISOString())
      .neq("order_status", "cancelled"),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", lastMonthStart.toISOString())
      .lt("created_at", monthStart.toISOString())
      .neq("order_status", "cancelled"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "pending_confirmation"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .eq("stock_quantity", 0),
  ]);

  const monthRevenue = (monthOrders ?? []).reduce((sum, o) => sum + o.total, 0);
  const lastMonthRevenue = (lastMonthOrders ?? []).reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <h1 className="font-serif text-3xl text-ink">Tableau de bord</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Commandes du jour"
          value={String(ordersToday ?? 0)}
          delta={{
            direction: (ordersToday ?? 0) >= (ordersYesterday ?? 0) ? "up" : "down",
            label: pctDelta(ordersToday ?? 0, ordersYesterday ?? 0),
          }}
        />
        <StatCard
          icon={Wallet}
          label="Chiffre du mois"
          value={formatTND(monthRevenue)}
          delta={{
            direction: monthRevenue >= lastMonthRevenue ? "up" : "down",
            label: pctDelta(monthRevenue, lastMonthRevenue),
          }}
        />
        <StatCard
          icon={Clock}
          label="Commandes en attente"
          value={String(pendingCount ?? 0)}
        />
        <StatCard
          icon={PackageX}
          label="Produits en rupture"
          value={String(outOfStockCount ?? 0)}
        />
      </div>
    </main>
  );
}
