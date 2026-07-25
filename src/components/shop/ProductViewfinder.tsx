"use client";

import { motion } from "motion/react";

// Coins fins + nom du produit qui apparaît lettre par lettre, superposés
// à la photo au survol ou au focus clavier (viseur d'appareil photo).
export function ProductViewfinder({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  return (
    <>
      <Corner active={active} className="top-2 left-2 border-t border-l" />
      <Corner active={active} className="top-2 right-2 border-t border-r" />
      <Corner active={active} className="bottom-2 left-2 border-b border-l" />
      <Corner active={active} className="bottom-2 right-2 border-b border-r" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-4"
      >
        <div className="flex flex-wrap justify-center">
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={
                active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
              }
              transition={{
                duration: 0.2,
                delay: active ? i * 0.02 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-sans text-[11px] tracking-[0.25em] text-gold uppercase"
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </div>
      </div>
    </>
  );
}

function Corner({ active, className }: { active: boolean; className: string }) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.85 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none absolute z-10 h-4 w-4 border-gold ${className}`}
    />
  );
}
