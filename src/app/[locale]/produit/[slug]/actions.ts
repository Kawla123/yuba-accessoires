"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewFormSchema } from "@/lib/validation/review";
import { getReviewFormState } from "@/lib/queries/reviews";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function submitReview(
  locale: string,
  slug: string,
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = reviewFormSchema.safeParse({
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Connecte-toi pour laisser un avis." };
  }

  // Re-vérifié côté serveur juste avant l'écriture : l'état affiché au
  // client n'est qu'un indice d'UI, jamais une preuve d'éligibilité.
  const state = await getReviewFormState(productId);
  if (state.status !== "can_review") {
    return {
      ok: false,
      error:
        state.status === "not_purchased"
          ? "Seuls les clients ayant acheté ce produit peuvent laisser un avis."
          : "Tu as déjà laissé un avis pour ce produit.",
    };
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("customer_name")
    .eq("id", state.orderId)
    .single<{ customer_name: string }>();

  const { error } = await admin.from("reviews").insert({
    product_id: productId,
    order_id: state.orderId,
    customer_name: order?.customer_name ?? "Client Yuba",
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    is_approved: false,
  });

  if (error) {
    console.error("[avis] échec de création:", error);
    return { ok: false, error: "Impossible d'enregistrer ton avis. Réessaie." };
  }

  revalidatePath(`/${locale}/produit/${slug}`);
  return { ok: true };
}
