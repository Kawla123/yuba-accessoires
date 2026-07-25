import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { Database } from "./types/database.types";

const intlMiddleware = createMiddleware(routing);

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export default async function middleware(request: NextRequest) {
  // /admin vit hors du préfixe de langue : pas de traitement next-intl,
  // mais protégé par rôle (profiles.role === 'admin').
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return handleAdminAuth(request);
  }

  const response = intlMiddleware(request);
  await refreshSupabaseSession(request, response);
  return response;
}

// Garde la session Supabase à jour sur toutes les pages du site (le
// panier/la commande ont besoin de savoir si le visiteur est connecté).
// Ignoré tant que Supabase n'est pas configuré (dev local sans .env.local) :
// le reste du site doit rester utilisable même sans backend branché.
async function refreshSupabaseSession(request: NextRequest, response: NextResponse) {
  if (!isSupabaseConfigured()) return;

  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    await supabase.auth.getUser();
  } catch (err) {
    console.error("[middleware] rafraîchissement de session impossible:", err);
  }
}

async function handleAdminAuth(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    console.error(
      "[middleware] Supabase non configuré : accès admin refusé par défaut.",
    );
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
  }

  const response = NextResponse.next();

  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL(`/${routing.defaultLocale}/connexion`, request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
    }

    return response;
  } catch (err) {
    console.error("[middleware] vérification admin impossible:", err);
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url));
  }
}

export const config = {
  // /admin traité séparément ci-dessus ; /api jamais réécrit.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
