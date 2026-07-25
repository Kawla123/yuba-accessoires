"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AccountLogoutButton({ locale }: { locale: string }) {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}`;
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2.5 px-3 py-2.5 font-sans text-sm text-charcoal/70 transition-colors hover:text-gold"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}
