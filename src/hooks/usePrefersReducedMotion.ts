"use client";

import { useEffect, useState } from "react";

// Toujours initialisé à false (y compris au premier rendu client) pour
// que le HTML généré côté serveur corresponde au premier rendu client :
// lire window.matchMedia dès l'état initial casserait l'hydratation
// Next.js si le visiteur a activé la réduction des animations.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
