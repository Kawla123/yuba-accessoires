"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { shippingAddressSchema } from "@/lib/validation/checkout";
import { sendOrderConfirmationEmail } from "@/lib/email/orderEmails";
import { createKonnectPayment, isKonnectConfigured } from "@/lib/konnect/client";

export type CheckoutCartItem = {
  productSlug: string;
  variantId?: string;
  name: string;
  priceTnd: number;
  quantity: number;
};

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string };

export async function createOrder(params: {
  locale: string;
  address: unknown;
  paymentMethod: "cod" | "konnect";
  items: CheckoutCartItem[];
}): Promise<CheckoutResult> {
  try {
    return await createOrderInternal(params);
  } catch (err) {
    // Filet de sécurité : si Supabase n'est pas configuré (pas de
    // .env.local en développement) ou toute autre panne inattendue, on
    // affiche un message propre au client plutôt qu'un plantage du Server
    // Action.
    console.error("[commande] erreur inattendue:", err);
    return {
      ok: false,
      error: "Une erreur est survenue. Réessaie dans un instant.",
    };
  }
}

async function createOrderInternal(params: {
  locale: string;
  address: unknown;
  paymentMethod: "cod" | "konnect";
  items: CheckoutCartItem[];
}): Promise<CheckoutResult> {
  const parsedAddress = shippingAddressSchema.safeParse(params.address);
  if (!parsedAddress.success) {
    return {
      ok: false,
      error: parsedAddress.error.issues[0]?.message ?? "Adresse invalide.",
    };
  }

  if (params.items.length === 0) {
    return { ok: false, error: "Le panier est vide." };
  }

  const address = parsedAddress.data;
  const subtotal = params.items.reduce(
    (sum, i) => sum + i.priceTnd * i.quantity,
    0,
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  // La session est lue via le client RLS classique (cookies), mais toutes
  // les écritures passent par le client admin : un checkout invité qui
  // relit sa commande juste après insertion (via .select().single()) a
  // besoin d'une policy SELECT que l'anon n'a pas — et il ne faut surtout
  // pas en ajouter une, ça exposerait toutes les commandes invités via
  // l'API publique. Le user_id vient d'une session vérifiée côté serveur,
  // jamais d'une valeur fournie par le client : la même garantie que la
  // policy RLS (un client ne peut pas s'attribuer la commande d'un autre),
  // simplement appliquée en code plutôt qu'en RLS pour cette action de
  // confiance.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      customer_name: address.customerName,
      customer_phone: address.customerPhone,
      customer_email: address.customerEmail || null,
      shipping_address: address.shippingAddress,
      city: address.city,
      governorate: address.governorate,
      payment_method: params.paymentMethod,
      subtotal,
      shipping_cost: shippingCost,
      total,
      user_id: user?.id ?? null,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    console.error("[commande] échec de création:", orderError);
    return { ok: false, error: "Impossible de créer la commande. Réessaie." };
  }

  await admin
    .from("order_status_history")
    .insert({ order_id: order.id, status: "pending_confirmation" });

  const { error: itemsError } = await admin.from("order_items").insert(
    params.items.map((item) => ({
      order_id: order.id,
      quantity: item.quantity,
      unit_price_at_purchase: item.priceTnd,
      product_name_snapshot: item.name,
    })),
  );

  if (itemsError) {
    console.error("[commande] échec d'enregistrement des articles:", itemsError);
    return {
      ok: false,
      error: "Commande créée mais articles non enregistrés — contacte-nous avec le numéro " +
        order.order_number,
    };
  }

  if (params.paymentMethod === "cod") {
    if (address.customerEmail) {
      await sendOrderConfirmationEmail({
        to: address.customerEmail,
        orderNumber: order.order_number,
        customerName: address.customerName,
        totalTnd: total,
        paymentMethod: "cod",
      });
    }

    return {
      ok: true,
      redirectUrl: `/${params.locale}/commande/confirmation/${order.order_number}`,
    };
  }

  // Paiement en ligne via Konnect.
  if (!isKonnectConfigured()) {
    return {
      ok: false,
      error:
        "Le paiement en ligne n'est pas disponible pour le moment. Choisis le paiement à la livraison.",
    };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const payment = await createKonnectPayment({
      amountMillimes: total * 10, // centimes -> millimes
      orderId: order.id,
      customerName: address.customerName,
      customerPhone: address.customerPhone,
      customerEmail: address.customerEmail || undefined,
      successUrl: `${origin}/${params.locale}/commande/confirmation/${order.order_number}`,
      failUrl: `${origin}/${params.locale}/commande?paiement=echec&commande=${order.order_number}`,
      webhookUrl: `${origin}/api/konnect/webhook`,
    });

    await admin
      .from("orders")
      .update({ konnect_payment_ref: payment.paymentRef })
      .eq("id", order.id);

    return { ok: true, redirectUrl: payment.payUrl };
  } catch (err) {
    console.error("[commande] échec Konnect:", err);
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Le paiement en ligne a échoué. Réessaie ou choisis le paiement à la livraison.",
    };
  }
}
