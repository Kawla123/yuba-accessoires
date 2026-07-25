"use client";

import { useState } from "react";
import { List, X } from "@phosphor-icons/react/ssr";

export function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center text-current"
      >
        {open ? <X size={22} /> : <List size={22} />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-40 border-t border-border bg-cream px-6 py-8 text-ink">
          {children}
        </div>
      ) : null}
    </div>
  );
}
