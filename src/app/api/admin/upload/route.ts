import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadProductImage, deleteProductImage } from "@/lib/supabase/storage";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// /api/admin/upload n'est pas couvert par le middleware (qui exclut tout
// /api/* — voir src/middleware.ts), donc la vérification du rôle admin doit
// être refaite ici explicitement, sans quoi n'importe qui pourrait uploader
// des fichiers vers le bucket.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, status: 401, error: "Non authentifié." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false as const, status: 403, error: "Accès refusé." };
  }
  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop volumineux (5 Mo max)." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Format d'image non supporté." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const path = `${crypto.randomUUID()}.${ext}`;

  try {
    const url = await uploadProductImage(path, bytes, file.type);
    return NextResponse.json({ path, url });
  } catch (err) {
    console.error("[upload] échec:", err);
    return NextResponse.json({ error: "Échec de l'upload." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Chemin manquant." }, { status: 400 });
  }

  await deleteProductImage(path);
  return NextResponse.json({ ok: true });
}
