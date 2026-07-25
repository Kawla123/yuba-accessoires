"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/commandes/[id]/actions";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { ORDER_STATUS_VALUES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/database.types";

export function QuickStatusMenu({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  function handleSelect(newStatus: OrderStatus) {
    setOpen(false);
    if (newStatus === status) return;
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      router.refresh();
    });
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="disabled:opacity-50"
      >
        <OrderStatusBadge status={status} />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute top-full left-0 z-20 mt-1 min-w-44 border border-border bg-cream py-1 shadow-sm">
            {ORDER_STATUS_VALUES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelect(s)}
                className={`block w-full px-3 py-2 text-left font-sans text-xs transition-colors hover:bg-cream-2 ${
                  s === status ? "text-ink" : "text-charcoal/70"
                }`}
              >
                {ORDER_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
