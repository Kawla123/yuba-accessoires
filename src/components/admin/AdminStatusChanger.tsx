"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/commandes/[id]/actions";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { ORDER_STATUS_VALUES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/database.types";

export function AdminStatusChanger({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [pendingChoice, setPendingChoice] = useState<OrderStatus | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function confirm() {
    if (!pendingChoice) return;
    const next = pendingChoice;
    setMessage(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next);
      if (result.ok) {
        setStatus(next);
        setMessage("Statut mis à jour, client notifié par email.");
      } else {
        setMessage(result.error ?? "Erreur.");
      }
      setPendingChoice(null);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-sans text-sm text-cream transition-colors hover:border-gold hover:bg-gold hover:text-ink"
      >
        Changer le statut <OrderStatusBadge status={status} />
      </button>

      {open ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {ORDER_STATUS_VALUES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={s === status}
              onClick={() => {
                setPendingChoice(s);
                setOpen(false);
              }}
              className="border border-border bg-cream px-3 py-1.5 font-sans text-xs text-charcoal/70 transition-colors hover:border-gold hover:text-ink disabled:opacity-40"
            >
              {ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      ) : null}

      {pendingChoice ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 border border-gold bg-gold/10 px-4 py-3">
          <p className="font-sans text-sm text-ink">
            Confirmer le passage à «&nbsp;{ORDER_STATUS_LABELS[pendingChoice]}&nbsp;» ?
          </p>
          <button
            type="button"
            onClick={confirm}
            disabled={pending}
            className="bg-ink px-4 py-1.5 font-sans text-xs text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
          >
            {pending ? "…" : "Confirmer"}
          </button>
          <button
            type="button"
            onClick={() => setPendingChoice(null)}
            className="font-sans text-xs text-charcoal/60 hover:text-ink"
          >
            Annuler
          </button>
        </div>
      ) : null}

      {message ? (
        <p className="mt-3 font-sans text-xs text-charcoal/60">{message}</p>
      ) : null}
    </div>
  );
}
