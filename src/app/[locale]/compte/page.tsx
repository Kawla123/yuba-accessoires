import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getOrdersByUserId } from "@/lib/queries/orders";
import { AccountTabs } from "@/components/compte/AccountTabs";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};

export default async function ComptePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Comme pour /admin (middleware.ts) : sans Supabase configuré, personne
  // ne peut être connecté — mieux vaut rediriger proprement que planter
  // avec "Your project's URL and Key are required...".
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect(`/${locale}/connexion?redirect=/compte`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/connexion?redirect=/compte`);
  }

  const [{ data: profile }, orders] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "first_name, last_name, phone, default_shipping_address, default_city, default_governorate",
      )
      .eq("id", user.id)
      .single(),
    getOrdersByUserId(user.id),
  ]);

  return (
    <main className="flex-1 bg-cream">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
          Yuba
        </p>
        <h1 className="mt-2 mb-10 font-serif text-4xl text-ink">Mon compte</h1>

        <AccountTabs
          locale={locale}
          email={user.email ?? ""}
          profile={{
            firstName: profile?.first_name ?? "",
            lastName: profile?.last_name ?? "",
            phone: profile?.phone ?? "",
            shippingAddress: profile?.default_shipping_address ?? "",
            city: profile?.default_city ?? "",
            governorate: profile?.default_governorate ?? "",
          }}
          orders={orders}
        />
      </div>
    </main>
  );
}
