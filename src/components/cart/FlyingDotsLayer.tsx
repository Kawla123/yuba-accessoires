"use client";

import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { useFlyingDots } from "@/lib/cart/flyingDots";

const SIZE = 44;

export function FlyingDotsLayer() {
  const dots = useFlyingDots((s) => s.dots);
  const remove = useFlyingDots((s) => s.remove);

  if (typeof document === "undefined" || dots.length === 0) return null;

  return createPortal(
    <>
      {dots.map((dot) => {
        const toX = dot.to.left + dot.to.width / 2 - SIZE / 2;
        const toY = dot.to.top + dot.to.height / 2 - SIZE / 2;
        return (
          <motion.div
            key={dot.id}
            initial={{
              left: dot.from.left + dot.from.width / 2 - SIZE / 2,
              top: dot.from.top + dot.from.height / 2 - SIZE / 2,
              opacity: 1,
              scale: 1,
            }}
            animate={{ left: toX, top: toY, opacity: 0.2, scale: 0.3 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => remove(dot.id)}
            style={{
              position: "fixed",
              width: SIZE,
              height: SIZE,
              zIndex: 200,
              backgroundColor: "var(--color-gold)",
              backgroundImage: dot.image ? `url(${dot.image})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>,
    document.body,
  );
}
