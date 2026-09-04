import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/ToastProvider";
import { createAdminClient } from "@/lib/supabase/admin";
import "../globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Administration | Yuba",
  robots: { index: false, follow: false },
};

// Le back-office lit toujours des données fraîches (commandes, stock) et a
// besoin de Supabase configuré à l'exécution : jamais de pré-rendu statique
// au moment du build.
export const dynamic = "force-dynamic";

async function getNewOrdersCount(): Promise<number> {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "pending_confirmation");
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function getPendingReviewsCount(): Promise<number> {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [newOrdersCount, pendingReviewsCount] = await Promise.all([
    getNewOrdersCount(),
    getPendingReviewsCount(),
  ]);

  return (
    <html lang="fr" className={jost.variable}>
      <body className="min-h-full antialiased">
        <AdminSidebar newOrdersCount={newOrdersCount} pendingReviewsCount={pendingReviewsCount} />
        <div className="min-h-screen bg-cream-2 md:pl-64">{children}</div>
        <ToastProvider />
      </body>
    </html>
  );
}
