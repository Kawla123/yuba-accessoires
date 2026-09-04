"use client";

import { useState } from "react";
import { Star } from "@phosphor-icons/react/ssr";

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const displayed = hovered || value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(n)}
          onClick={() => onChange(n)}
          className="text-gold transition-transform hover:scale-110"
        >
          <Star size={24} weight={n <= displayed ? "fill" : "regular"} />
        </button>
      ))}
    </div>
  );
}
