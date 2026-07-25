import type { OrderStatus } from "@/types/database.types";

export const ORDER_STATUS_VALUES: OrderStatus[] = [
  "pending_confirmation",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_confirmation: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

// Classes Tailwind par statut : doré pour tout ce qui est en cours, vert
// doux pour livrée, gris pour annulée — cf. brief de modernisation admin.
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending_confirmation: "bg-gold/10 text-gold-dim",
  confirmed: "bg-gold/15 text-gold-dim",
  shipped: "bg-gold/25 text-ink",
  delivered: "bg-[#e1ecd9] text-[#4a6b3a]",
  cancelled: "bg-charcoal/10 text-charcoal/60",
};

// Position sur la frise de suivi client (pending_confirmation n'a pas
// encore atteint le premier point ; cancelled n'a pas de position).
export const ORDER_TIMELINE_STEPS = [
  "Confirmée",
  "Préparation",
  "Expédiée",
  "Livrée",
] as const;

export function timelineActiveIndex(status: OrderStatus): number {
  switch (status) {
    case "confirmed":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return -1;
  }
}
