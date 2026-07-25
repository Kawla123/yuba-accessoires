"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Vitesses par colonne (grille 4 colonnes desktop) : léger décalage
// vertical, jamais plus de ±6%.
const SPEEDS = [-6, -2, 2, 6];

export function BreathingGridItem({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;

    // gsap.matchMedia scope l'effet à >=1024px et se charge lui-même de
    // tout défaire si le viewport repasse sous ce seuil (resize, rotation).
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        gsap.to(el, {
          yPercent: SPEEDS[index % SPEEDS.length],
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [reducedMotion, index]);

  return <div ref={ref}>{children}</div>;
}
