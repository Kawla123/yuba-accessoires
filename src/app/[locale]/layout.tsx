import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Analytics } from "@/components/site/Analytics";
import { ToastProvider } from "@/components/ToastProvider";
import { FlyingDotsLayer } from "@/components/cart/FlyingDotsLayer";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const description = t("heroSubtitle");

  return {
    title: {
      default: "Yuba Accessoires — Bijoux et accessoires de Djerba",
      template: "%s | Yuba Accessoires",
    },
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://yuba-bijoux.com",
    ),
    alternates: {
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Yuba Accessoires",
      title: "Yuba Accessoires — Bijoux et accessoires de Djerba",
      description,
      locale,
      images: [
        {
          url: "/images/collection-homme.jpg",
          width: 1400,
          height: 787,
          alt: "Yuba Accessoires",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Yuba Accessoires — Bijoux et accessoires de Djerba",
      description,
      images: ["/images/collection-homme.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider>
          <Header />
          {children}
          <Footer />
          <ToastProvider />
          <FlyingDotsLayer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
