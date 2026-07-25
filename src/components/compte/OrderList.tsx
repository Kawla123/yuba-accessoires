import { OrderCard } from "./OrderCard";
import type { OrderWithItems } from "@/lib/queries/orders";

export function OrderList({ orders }: { orders: OrderWithItems[] }) {
  if (orders.length === 0) {
    return (
      <p className="font-sans text-sm text-charcoal/60">
        Aucune commande pour l&rsquo;instant.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
