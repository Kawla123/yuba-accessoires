"use client";

import { useEffect, useRef } from "react";
import { Handbag } from "@phosphor-icons/react/ssr";
import { motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useCartStore, cartItemCount } from "@/lib/cart/store";
import { flyToCartTarget } from "@/lib/cart/flyToCartTarget";

export function CartLink({ label }: { label: string }) {
  const count = useCartStore((s) => cartItemCount(s.items));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function updateTarget() {
      flyToCartTarget.current = ref.current?.getBoundingClientRect() ?? null;
    }
    updateTarget();
    window.addEventListener("resize", updateTarget);
    return () => window.removeEventListener("resize", updateTarget);
  }, []);

  return (
    <Link href="/panier" aria-label={label} className="text-current hover:text-gold">
      <span ref={ref} className="relative inline-flex">
        <Handbag size={20} />
        {count > 0 ? (
          <motion.span
            key={count}
            initial={{ scale: 1.6 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 font-sans text-[10px] text-cream"
          >
            {count}
          </motion.span>
        ) : null}
      </span>
    </Link>
  );
}
