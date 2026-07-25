"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

// La commande existe déjà en base à ce stade (COD confirmé, ou retour
// Konnect réussi) : on vide le panier local une fois la confirmation
// affichée, quel que soit le mode de paiement.
export function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
