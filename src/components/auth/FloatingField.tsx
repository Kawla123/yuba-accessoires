"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";

export function FloatingField({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        required={required}
        className="peer w-full border border-cream/25 bg-transparent px-4 pt-5 pb-2 font-sans text-sm text-cream outline-none transition-colors focus:border-gold"
      />
      <motion.label
        htmlFor={id}
        initial={false}
        animate={{
          y: floated ? 7 : 16,
          scale: floated ? 0.75 : 1,
          color: focused ? "var(--color-gold)" : "rgba(246,236,226,0.5)",
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-4 top-0 origin-left font-sans text-sm tracking-wide uppercase"
      >
        {label}
      </motion.label>
    </div>
  );
}
