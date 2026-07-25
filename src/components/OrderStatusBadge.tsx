import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types/database.types";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/orderStatus";

const ICONS: Record<OrderStatus, typeof Clock> = {
  pending_confirmation: Clock,
  confirmed: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const Icon = ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-sans text-xs ${ORDER_STATUS_STYLES[status]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
