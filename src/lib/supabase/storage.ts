import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "produits";

// URL publique stable des buckets Supabase Storage : pas besoin d'un
// client pour la construire, c'est une simple concaténation.
export function getPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function uploadProductImage(
  path: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  return getPublicUrl(path);
}

export async function deleteProductImage(path: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
