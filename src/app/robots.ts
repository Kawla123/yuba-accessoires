import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuba-bijoux.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        "/*/connexion",
        "/*/inscription",
        "/*/compte",
        "/*/panier",
        "/*/commande",
        "/*/mot-de-passe-oublie",
        "/*/reinitialiser-mot-de-passe",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
