import { NextResponse } from "next/server";

// Envoi du formulaire de contact via Resend — implémenté en phase 2.
export async function POST() {
  return NextResponse.json(
    { message: "Formulaire de contact — implémenté en phase 2." },
    { status: 501 },
  );
}
