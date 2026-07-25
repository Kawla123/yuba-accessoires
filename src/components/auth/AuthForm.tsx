"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, signupSchema } from "@/lib/validation/auth";
import { FloatingField } from "./FloatingField";

type Mode = "login" | "signup";

export function AuthForm({
  initialMode,
  redirectTo,
}: {
  initialMode: Mode;
  redirectTo: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function goToDestination() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        // /admin vit hors du préfixe de langue : navigation brute pour
        // éviter que next-intl n'y ajoute un préfixe /fr par erreur.
        window.location.href = "/admin";
        return;
      }
    }

    if (redirectTo.startsWith("/admin")) {
      window.location.href = redirectTo;
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword(
      parsed.data,
    );

    if (authError) {
      setPending(false);
      setError(
        authError.message.includes("Invalid login credentials")
          ? "Email ou mot de passe incorrect."
          : authError.message,
      );
      return;
    }

    await goToDestination();
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
        },
      },
    });

    if (authError) {
      setPending(false);
      setError(
        authError.message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : authError.message,
      );
      return;
    }

    if (data.session) {
      await goToDestination();
    } else {
      setPending(false);
      setCheckEmail(true);
    }
  }

  return (
    <div>
      <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
        Yuba
      </p>

      <div className="relative mt-3 mb-8 grid grid-cols-2 border border-cream/25">
        <ToggleTab
          active={mode === "login"}
          label="Se connecter"
          onClick={() => {
            setMode("login");
            setError(null);
            setCheckEmail(false);
          }}
        />
        <ToggleTab
          active={mode === "signup"}
          label="Créer un compte"
          onClick={() => {
            setMode("signup");
            setError(null);
            setCheckEmail(false);
          }}
        />
      </div>

      {checkEmail ? (
        <p className="font-sans text-sm text-cream/80">
          Compte créé. Vérifie tes emails pour confirmer ton adresse avant de
          te connecter.
        </p>
      ) : (
        <form
          onSubmit={mode === "login" ? handleLogin : handleSignup}
          className="space-y-5"
        >
          <AnimatePresence initial={false}>
            {mode === "signup" ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4 pb-5">
                  <FloatingField
                    label="Prénom"
                    type="text"
                    value={firstName}
                    onChange={setFirstName}
                  />
                  <FloatingField
                    label="Nom"
                    type="text"
                    value={lastName}
                    onChange={setLastName}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <FloatingField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          <FloatingField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {error ? <p className="font-sans text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 font-sans text-sm text-ink transition-colors hover:bg-gold-dim disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {pending
              ? mode === "login"
                ? "Connexion…"
                : "Création…"
              : mode === "login"
                ? "Se connecter"
                : "Créer mon compte"}
          </button>

          {mode === "login" ? (
            <div className="flex items-center justify-between font-sans text-xs text-cream/60">
              <Link href="/mot-de-passe-oublie" className="hover:text-gold">
                Mot de passe oublié ?
              </Link>
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}

function ToggleTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative py-3 font-sans text-sm transition-colors"
    >
      {active ? (
        <motion.span
          layoutId="auth-toggle-pill"
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 bg-gold"
        />
      ) : null}
      <span
        className={`relative z-10 ${active ? "text-ink" : "text-cream/70"}`}
      >
        {label}
      </span>
    </button>
  );
}
