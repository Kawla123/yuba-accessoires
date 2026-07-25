"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/fr";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-3 px-3 py-2.5 font-sans text-sm text-cream/60 transition-colors hover:text-gold"
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}
