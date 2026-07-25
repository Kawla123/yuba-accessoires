"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@/lib/validation/auth";
import { FloatingField } from "./FloatingField";

export function ForgotPasswordForm({ locale }: { locale: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      {
        redirectTo: `${window.location.origin}/${locale}/reinitialiser-mot-de-passe`,
      },
    );
    setPending(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <p className="font-sans text-sm text-cream/80">
        Si un compte existe avec cet email, un lien de réinitialisation vient
        d&rsquo;être envoyé.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FloatingField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />
      {error ? <p className="font-sans text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 font-sans text-sm text-ink transition-colors hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </button>
    </form>
  );
}
