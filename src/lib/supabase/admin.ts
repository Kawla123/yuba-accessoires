import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// Client Supabase avec la clé service_role : contourne RLS.
// Réservé au back-office et aux route handlers serveur de confiance
// (upload admin, webhook Konnect, envoi d'emails transactionnels).
// Ne jamais importer ce fichier depuis un Client Component.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
