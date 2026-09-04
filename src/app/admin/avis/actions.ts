"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function approveReview(reviewId: string) {
  const supabase = createAdminClient();
  await supabase.from("reviews").update({ is_approved: true }).eq("id", reviewId);
  revalidatePath("/admin/avis");
}

export async function rejectReview(reviewId: string) {
  const supabase = createAdminClient();
  await supabase.from("reviews").delete().eq("id", reviewId);
  revalidatePath("/admin/avis");
}

export async function unpublishReview(reviewId: string) {
  const supabase = createAdminClient();
  await supabase.from("reviews").update({ is_approved: false }).eq("id", reviewId);
  revalidatePath("/admin/avis");
}
