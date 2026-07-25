import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false, follow: false },
};

export default async function InscriptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { redirect } = await searchParams;
  const redirectTo = redirect?.startsWith("/") ? redirect : "/compte";

  return (
    <main className="flex-1">
      <AuthSplitShell photoSrc="/images/femme-visage-bijoux.jpg">
        <AuthForm initialMode="signup" redirectTo={redirectTo} />
      </AuthSplitShell>
    </main>
  );
}
