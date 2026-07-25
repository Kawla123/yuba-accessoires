"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SIZE = 260;

// Reflet métallique qui suit le curseur. À placer comme enfant direct
// d'un conteneur `relative overflow-hidden` — écoute le mousemove sur ce
// parent (jamais sur window), et ne fait rien sur les écrans tactiles
// puisqu'aucun mousemove n'y est jamais déclenché.
export function CursorSheen() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-SIZE);
  const my = useMotionValue(-SIZE);
  const sx = useSpring(mx, { stiffness: 140, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 140, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reducedMotion) return;
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    function handleMove(e: MouseEvent) {
      const rect = parent!.getBoundingClientRect();
      mx.set(e.clientX - rect.left - SIZE / 2);
      my.set(e.clientY - rect.top - SIZE / 2);
    }

    parent.addEventListener("mousemove", handleMove);
    return () => parent.removeEventListener("mousemove", handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{
          x: sx,
          y: sy,
          width: SIZE,
          height: SIZE,
          // rgb(199,201,206) = --color-silver existant, converti car les
          // radial-gradient CSS n'acceptent pas les var() dans les stops
          // d'opacité combinées ici sans re-déclarer la couleur en rgba.
          background:
            "radial-gradient(circle, rgba(199,201,206,0.12) 0%, rgba(199,201,206,0.05) 40%, transparent 70%)",
          mixBlendMode: "overlay",
        }}
        className="absolute"
      />
    </div>
  );
}
