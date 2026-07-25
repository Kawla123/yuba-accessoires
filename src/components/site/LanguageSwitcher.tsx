"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { fr: "FR", en: "EN" };

// Dépend de usePathname (next-intl), qui nécessite un Client Component :
// c'est la seule raison de sortir ce petit composant du rendu serveur.
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      className={`flex items-center gap-1 font-sans text-xs ${className ?? ""}`}
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          {i > 0 ? <span className="text-current/30">/</span> : null}
          <Link
            href={pathname}
            locale={loc}
            className={
              loc === locale
                ? "text-current underline underline-offset-4 decoration-gold"
                : "text-current/50 hover:text-current"
            }
          >
            {LABELS[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}
