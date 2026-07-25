import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: false },
};

export default async function MotDePasseOubliePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex-1">
      <AuthSplitShell photoSrc="/images/femme-visage-bijoux.jpg">
        <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
          Yuba
        </p>
        <h1 className="mt-3 mb-8 font-serif text-3xl text-cream">
          Mot de passe oublié
        </h1>
        <ForgotPasswordForm locale={locale} />
      </AuthSplitShell>
    </main>
  );
}
