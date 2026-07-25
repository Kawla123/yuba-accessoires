import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

// Client Supabase pour les Server Components / Route Handlers (clé anon,
// RLS actif). Les écritures de cookies échouent silencieusement lorsque
// appelées depuis un Server Component pur : le middleware next-intl gère
// déjà le rafraîchissement de session dans ce cas.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component : ignoré volontairement.
          }
        },
      },
    },
  );
}
