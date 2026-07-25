import type { OrderStatus } from "@/types/database.types";
import { ORDER_TIMELINE_STEPS, timelineActiveIndex } from "@/lib/orderStatus";

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <p className="font-sans text-xs text-charcoal/50">
        Cette commande a été annulée.
      </p>
    );
  }

  const activeIndex = timelineActiveIndex(status);

  return (
    <div className="flex items-center">
      {ORDER_TIMELINE_STEPS.map((label, i) => {
        const filled = i <= activeIndex;
        const lineFilled = i < activeIndex;
        return (
          <div
            key={label}
            className={`flex items-center ${i < ORDER_TIMELINE_STEPS.length - 1 ? "flex-1" : "flex-none"}`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 flex-none ${filled ? "bg-gold" : "bg-charcoal/15"}`}
              />
              <span
                className={`whitespace-nowrap font-sans text-[10px] tracking-wide uppercase ${
                  filled ? "text-ink" : "text-charcoal/40"
                }`}
              >
                {label}
              </span>
            </div>
            {i < ORDER_TIMELINE_STEPS.length - 1 ? (
              <span
                className={`mx-1 mb-4 h-px flex-1 ${lineFilled ? "bg-gold" : "bg-charcoal/15"}`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
