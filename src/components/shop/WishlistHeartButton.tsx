"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useWishlistStore } from "@/lib/wishlist/store";

export function WishlistHeartButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const active = useWishlistStore((s) => s.has(slug));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={active ? "Retirer de la liste d'envies" : "Ajouter à la liste d'envies"}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center bg-cream/90 text-ink ${className ?? ""}`}
    >
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Heart className="h-4 w-4" fill={active ? "var(--color-gold)" : "none"} stroke={active ? "var(--color-gold)" : "currentColor"} />
      </motion.span>
    </button>
  );
}
