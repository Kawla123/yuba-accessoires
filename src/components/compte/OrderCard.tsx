"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatTND } from "@/lib/format";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import type { OrderWithItems } from "@/lib/queries/orders";

export function OrderCard({ order }: { order: OrderWithItems }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border bg-cream">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <p className="font-sans text-sm text-ink">{order.order_number}</p>
          <p className="font-sans text-xs text-charcoal/60">
            {new Date(order.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <OrderStatusBadge status={order.order_status} />
        <p className="font-serif text-lg text-ink">{formatTND(order.total)}</p>
        <span className="font-sans text-xs text-gold underline underline-offset-4">
          {open ? "Masquer" : "Voir le détail"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="px-5 py-5">
              <OrderStatusTimeline status={order.order_status} />
              <ul className="mt-6 divide-y divide-border">
                {order.order_items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2.5 font-sans text-sm text-ink"
                  >
                    <span>
                      {item.product_name_snapshot} × {item.quantity}
                    </span>
                    <span>
                      {formatTND(item.unit_price_at_purchase * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
