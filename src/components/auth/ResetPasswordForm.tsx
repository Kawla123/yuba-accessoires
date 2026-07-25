"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { FloatingField } from "./FloatingField";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    setPending(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/connexion");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FloatingField
        label="Nouveau mot de passe"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
      />
      <FloatingField
        label="Confirmer le mot de passe"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
      />
      {error ? <p className="font-sans text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 font-sans text-sm text-ink transition-colors hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Enregistrement…" : "Enregistrer le nouveau mot de passe"}
      </button>
    </form>
  );
}
