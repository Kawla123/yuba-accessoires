import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Un pnpm-lock.yaml perdu dans le dossier utilisateur (hors de ce projet)
  // fait sinon échouer la détection automatique de la racine du workspace.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Toutes les images passent par Cloudflare R2 (jamais par Netlify).
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_R2_PUBLIC_HOSTNAME ?? "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDN_HOSTNAME ?? "cdn.yuba-bijoux.com",
      },
      {
        // Repli temporaire tant qu'un produit n'a pas de vraie photo
        // (src/lib/placeholder.ts) — à retirer une fois le catalogue rempli.
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Photos produits hébergées sur Supabase Storage (bucket public
        // "produits" — voir src/lib/supabase/storage.ts).
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
