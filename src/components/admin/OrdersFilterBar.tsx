"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { ORDER_STATUS_VALUES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";

export function OrdersFilterBar({
  statut,
  q,
}: {
  statut?: string;
  q?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(q ?? "");

  function pushParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("tri");
    params.delete("dir");
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      if (search !== (q ?? "")) pushParams({ q: search || undefined });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <StatusChip
          label="Toutes"
          active={!statut}
          onClick={() => pushParams({ statut: undefined })}
        />
        {ORDER_STATUS_VALUES.map((s) => (
          <StatusChip
            key={s}
            label={ORDER_STATUS_LABELS[s]}
            active={statut === s}
            onClick={() => pushParams({ statut: s })}
          />
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nom client ou n° de commande"
          className="w-full border border-border bg-cream py-2.5 pr-4 pl-9 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </div>
    </div>
  );
}

function StatusChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 font-sans text-xs transition-colors ${
        active ? "bg-ink text-cream" : "bg-cream text-charcoal/70 hover:bg-cream-2"
      }`}
    >
      {label}
    </button>
  );
}
