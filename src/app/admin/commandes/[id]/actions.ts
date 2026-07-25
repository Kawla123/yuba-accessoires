"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderStatusUpdateEmail } from "@/lib/email/orderEmails";
import type { OrderStatus } from "@/types/database.types";

const VALID_STATUSES = [
  "pending_confirmation",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export async function updateOrderStatus(orderId: string, newStatus: string) {
  if (!VALID_STATUSES.includes(newStatus as (typeof VALID_STATUSES)[number])) {
    return { ok: false, error: "Statut invalide." };
  }
  const validatedStatus = newStatus as OrderStatus;

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .update({ order_status: validatedStatus })
    .eq("id", orderId)
    .select("order_number, customer_name, customer_email")
    .single();

  if (error || !order) {
    return { ok: false, error: "Échec de la mise à jour." };
  }

  await supabase
    .from("order_status_history")
    .insert({ order_id: orderId, status: validatedStatus });

  if (order.customer_email) {
    await sendOrderStatusUpdateEmail({
      to: order.customer_email,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      orderStatus: newStatus,
    });
  }

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");

  return { ok: true };
}
