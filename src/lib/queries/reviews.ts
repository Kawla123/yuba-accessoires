import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type ProductReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

// Avis approuvés d'un produit : lus via le client RLS classique, la
// policy "approved reviews are publicly readable" (migration 0008)
// couvre déjà ce cas.
export async function getApprovedReviewsForProduct(
  productId: string,
): Promise<ProductReview[]> {
  if (!isSupabaseConfigured() || !productId) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, comment, created_at")
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .returns<ReviewRow[]>();

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

export type ReviewFormState =
  | { status: "logged_out" }
  | { status: "not_purchased" }
  | { status: "already_reviewed" }
  | { status: "pending_moderation" }
  | { status: "can_review"; orderId: string };

type EligibleOrderRow = {
  order_id: string;
  orders: { order_status: string; created_at: string } | null;
};

// Un avis n'est proposé que sur un produit réellement acheté (commande
// non annulée) par le client connecté — user_id vient d'une session
// vérifiée côté serveur, jamais d'une valeur fournie par le client
// (même garantie que commande/actions.ts). On lit via le client admin
// pour pouvoir aussi détecter un avis déjà déposé mais pas encore
// approuvé (invisible par RLS côté anon/authenticated).
export async function getReviewFormState(productId: string): Promise<ReviewFormState> {
  if (!isSupabaseConfigured() || !productId) return { status: "not_purchased" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "logged_out" };

  const admin = createAdminClient();

  const { data: items } = await admin
    .from("order_items")
    .select("order_id, orders!inner(order_status, created_at, user_id)")
    .eq("product_id", productId)
    .eq("orders.user_id", user.id)
    .neq("orders.order_status", "cancelled")
    .returns<EligibleOrderRow[]>();

  if (!items || items.length === 0) {
    return { status: "not_purchased" };
  }

  const orderIds = [...items]
    .sort(
      (a, b) =>
        new Date(b.orders?.created_at ?? 0).getTime() -
        new Date(a.orders?.created_at ?? 0).getTime(),
    )
    .map((i) => i.order_id);

  const { data: existing } = await admin
    .from("reviews")
    .select("id, is_approved")
    .eq("product_id", productId)
    .in("order_id", orderIds)
    .returns<{ id: string; is_approved: boolean }[]>();

  if (existing && existing.length > 0) {
    return existing.some((r) => r.is_approved)
      ? { status: "already_reviewed" }
      : { status: "pending_moderation" };
  }

  return { status: "can_review", orderId: orderIds[0] };
}
