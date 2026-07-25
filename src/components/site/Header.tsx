import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { ScrollAwareHeader } from "./ScrollAwareHeader";
import { CartLink } from "./CartLink";
import { AccountLink } from "./AccountLink";

function NavLinks({ className }: { className?: string }) {
  const t = useTranslations("nav");

  return (
    <nav className={className}>
      <Link href="/boutique" className="hover:text-gold">
        {t("shop")}
      </Link>
      <Link href="/atelier" className="hover:text-gold">
        {t("workshop")}
      </Link>
      <Link href="/contact" className="hover:text-gold">
        {t("contact")}
      </Link>
    </nav>
  );
}

export function Header() {
  const t = useTranslations("nav");

  return (
    <ScrollAwareHeader>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-6 px-6 sm:px-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.15em] text-current">
          YUBA
        </Link>

        <NavLinks className="hidden items-center gap-8 font-sans text-sm text-current/80 md:flex" />

        <div className="flex items-center gap-5">
          <LanguageSwitcher className="hidden text-current sm:flex" />
          <AccountLink label={t("account")} />
          <CartLink label={t("cart")} />
          <MobileMenuToggle>
            <div className="flex flex-col gap-6">
              <NavLinks className="flex flex-col gap-5 font-serif text-2xl text-ink" />
              <LanguageSwitcher className="text-ink" />
              <Link href="/compte" className="font-serif text-2xl text-ink">
                {t("account")}
              </Link>
            </div>
          </MobileMenuToggle>
        </div>
      </div>
    </ScrollAwareHeader>
  );
}
