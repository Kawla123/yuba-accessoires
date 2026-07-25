import { NextResponse } from "next/server";

// Flux catalogue produits au format Meta (CSV/XML) pour Commerce Manager.
// Instagram/Facebook Shop natif est indisponible en Tunisie : ce flux
// alimente le Commerce Manager manuellement, aucun bouton d'achat intégré.
export async function GET() {
  return NextResponse.json(
    { message: "Flux catalogue Meta — implémenté en phase 5." },
    { status: 501 },
  );
}
