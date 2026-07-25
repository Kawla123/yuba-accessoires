import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type OrderWithItems = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string;
  governorate: string;
  payment_method: "cod" | "konnect";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_status:
    | "pending_confirmation"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    unit_price_at_purchase: number;
    product_name_snapshot: string;
  }[];
};

// La confirmation est publique (le client n'est pas forcément connecté) :
// on la sert côté serveur avec la clé service_role, filtrée sur le numéro
// de commande — jamais de policy RLS publique sur `orders` (voir 0008).
export async function getOrderByNumber(
  orderNumber: string,
): Promise<OrderWithItems | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, customer_email, shipping_address, city, governorate, payment_method, payment_status, order_status, subtotal, shipping_cost, total, created_at, order_items(id, quantity, unit_price_at_purchase, product_name_snapshot)",
    )
    .eq("order_number", orderNumber)
    .maybeSingle<OrderWithItems>();

  if (error) {
    console.error("[orders] échec de lecture:", error);
    return null;
  }

  return data;
}

// Espace client : lecture scopée par RLS (policy "customers can view their
// own orders", migration 0010), jamais la clé service_role ici.
export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, customer_email, shipping_address, city, governorate, payment_method, payment_status, order_status, subtotal, shipping_cost, total, created_at, order_items(id, quantity, unit_price_at_purchase, product_name_snapshot)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<OrderWithItems[]>();

  if (error) {
    console.error("[compte] échec de lecture des commandes:", error);
    return [];
  }

  return data ?? [];
}
