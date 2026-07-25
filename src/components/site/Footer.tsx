import { useTranslations } from "next-intl";
import {
  Truck,
  ArrowCounterClockwise,
  Phone,
  MapPin,
} from "@phosphor-icons/react/ssr";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-cream-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl text-ink">YUBA</p>
          <p className="mt-3 max-w-xs font-sans text-sm text-charcoal/70">
            {t("tagline")}
          </p>
        </div>

        <div className="font-sans text-sm">
          <p className="mb-3 tracking-wide text-ink uppercase">Boutique</p>
          <ul className="space-y-2 text-charcoal/70">
            <li>
              <Link href="/boutique" className="hover:text-gold">
                Toute la collection
              </Link>
            </li>
            <li>
              <Link href="/atelier" className="hover:text-gold">
                L&rsquo;atelier
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="font-sans text-sm">
          <p className="mb-3 tracking-wide text-ink uppercase">Informations</p>
          <ul className="space-y-2 text-charcoal/70">
            <li>
              <Link href="/faq" className="hover:text-gold">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/livraison-et-retours" className="hover:text-gold">
                Livraison et retours
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-gold">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link
                href="/politique-de-confidentialite"
                className="hover:text-gold"
              >
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>

        <div className="font-sans text-sm text-charcoal/70">
          <p className="mb-3 tracking-wide text-ink uppercase">Atelier</p>
          <p className="flex items-start gap-2">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
            Houmt Souk, Djerba, Tunisie
          </p>
          <p className="mt-2 flex items-center gap-2">
            <Phone size={18} className="shrink-0 text-gold" />
            <a href="tel:+21628211326" className="hover:text-gold">
              28 211 326
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 font-sans text-xs text-charcoal/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Yuba. {t("rights")}.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5">
              <Truck size={16} className="text-gold" />
              {t("codBadge")}
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowCounterClockwise size={16} className="text-gold" />
              {t("returnsBadge")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
