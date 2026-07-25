import { NextResponse } from "next/server";

// Inscription newsletter avec code de bienvenue — implémenté en phase 2/3.
export async function POST() {
  return NextResponse.json(
    { message: "Inscription newsletter — implémentée en phase 2." },
    { status: 501 },
  );
}
