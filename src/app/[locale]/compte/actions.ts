"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { GOVERNORATES } from "@/lib/validation/checkout";

const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis."),
  lastName: z.string().trim().min(1, "Nom requis."),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s]{8,}$/, "Numéro de téléphone invalide.")
    .optional()
    .or(z.literal("")),
});

const addressSchema = z.object({
  shippingAddress: z.string().trim().min(5, "Adresse requise."),
  city: z.string().trim().min(1, "Ville requise."),
  governorate: z.enum(GOVERNORATES, { message: "Gouvernorat requis." }),
});

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Session expirée, reconnecte-toi." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: "Impossible d'enregistrer." };
  }

  revalidatePath("/[locale]/compte", "page");
  return { ok: true };
}

export async function updateAddress(formData: FormData): Promise<ActionResult> {
  const parsed = addressSchema.safeParse({
    shippingAddress: formData.get("shippingAddress"),
    city: formData.get("city"),
    governorate: formData.get("governorate"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Session expirée, reconnecte-toi." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      default_shipping_address: parsed.data.shippingAddress,
      default_city: parsed.data.city,
      default_governorate: parsed.data.governorate,
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: "Impossible d'enregistrer." };
  }

  revalidatePath("/[locale]/compte", "page");
  return { ok: true };
}
