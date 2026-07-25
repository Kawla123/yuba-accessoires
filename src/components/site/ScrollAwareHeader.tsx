"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";

// Sur l'accueil, l'en-tête flotte transparent sur le hero puis devient
// opaque au scroll (IntersectionObserver sur un sentinel, jamais un
// listener de scroll). Sur les autres pages, il n'y a pas de hero derrière
// lui : il reste positionné normalement, toujours opaque, comme avant.
export function ScrollAwareHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isHome]);

  if (!isHome) {
    return (
      <header className="relative z-50 border-b border-border bg-cream text-ink">
        {children}
      </header>
    );
  }

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="absolute top-0 h-px w-full" />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-border bg-cream text-ink"
            : "border-b border-transparent bg-transparent text-cream"
        }`}
      >
        {children}
      </header>
    </>
  );
}
