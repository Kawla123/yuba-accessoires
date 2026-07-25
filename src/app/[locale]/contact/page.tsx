import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MapPin, Phone, Envelope, InstagramLogo } from "@phosphor-icons/react/ssr";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacte Yuba Accessoires à Houmt Souk, Djerba — téléphone, email et Instagram.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-6 py-24 sm:px-10">
        <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
          Yuba
        </p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
          Contact
        </h1>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 font-sans text-base text-charcoal/80">
            <p className="font-serif text-2xl text-ink italic">
              Yuba Accessoires
            </p>

            <p className="flex items-start gap-3">
              <MapPin size={22} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Houmt Souk, Djerba, Tunisie
                <br />à côté de Meuble Aroua
              </span>
            </p>

            <p className="flex items-center gap-3">
              <Phone size={22} className="shrink-0 text-gold" />
              <a href="tel:+21628211326" className="hover:text-gold">
                28 211 326
              </a>
            </p>

            <p className="flex items-center gap-3">
              <Envelope size={22} className="shrink-0 text-gold" />
              <a href="mailto:khaoula.isims@gmail.com" className="hover:text-gold">
                khaoula.isims@gmail.com
              </a>
            </p>

            <a
              href="https://www.instagram.com/yuba_djerba/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 border border-ink px-5 py-2.5 font-sans text-sm text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramLogo size={20} />
              @yuba_djerba
            </a>
          </div>

          <div className="aspect-square w-full overflow-hidden border border-border lg:aspect-auto">
            <iframe
              title="Yuba Accessoires — Houmt Souk, Djerba"
              src="https://maps.google.com/maps?q=Houmt+Souk,+Djerba,+Tunisie&z=14&output=embed"
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
