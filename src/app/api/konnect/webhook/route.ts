import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getKonnectPayment } from "@/lib/konnect/client";
import { sendOrderConfirmationEmail } from "@/lib/email/orderEmails";

// Konnect n'envoie pas de charge utile signée (pas de HMAC comme Stripe) :
// il notifie juste qu'un paiement a évolué via ?payment_ref=..., et on
// revérifie systématiquement le statut auprès de leur API avec notre clé
// secrète avant de toucher à la commande — jamais confiance dans le seul
// appel webhook.
export async function GET(request: NextRequest) {
  return handleWebhook(request);
}

export async function POST(request: NextRequest) {
  return handleWebhook(request);
}

async function handleWebhook(request: NextRequest) {
  const paymentRef = request.nextUrl.searchParams.get("payment_ref");
  if (!paymentRef) {
    return NextResponse.json({ error: "payment_ref manquant" }, { status: 400 });
  }

  let status: Awaited<ReturnType<typeof getKonnectPayment>>["status"];
  try {
    ({ status } = await getKonnectPayment(paymentRef));
  } catch (err) {
    console.error("[konnect webhook] échec de vérification:", err);
    return NextResponse.json({ error: "vérification impossible" }, { status: 502 });
  }

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_email, total")
    .eq("konnect_payment_ref", paymentRef)
    .single();

  if (error || !order) {
    console.error("[konnect webhook] commande introuvable pour", paymentRef);
    return NextResponse.json({ error: "commande introuvable" }, { status: 404 });
  }

  if (status === "completed") {
    await supabase
      .from("orders")
      .update({ payment_status: "paid", order_status: "confirmed" })
      .eq("id", order.id);

    if (order.customer_email) {
      await sendOrderConfirmationEmail({
        to: order.customer_email,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        totalTnd: order.total,
        paymentMethod: "konnect",
      });
    }
  } else if (status === "failed" || status === "expired") {
    await supabase
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("id", order.id);
  }

  return NextResponse.json({ received: true });
}
