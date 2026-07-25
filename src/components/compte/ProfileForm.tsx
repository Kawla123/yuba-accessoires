"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Field } from "@/components/auth/Field";
import { updateProfile } from "@/app/[locale]/compte/actions";

export function ProfileForm({
  email,
  initial,
}: {
  email: string;
  initial: { firstName: string; lastName: string; phone: string };
}) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("firstName", firstName);
    formData.set("lastName", lastName);
    formData.set("phone", phone);

    const result = await updateProfile(formData);
    setPending(false);
    setMessage(result.ok ? "Informations enregistrées." : result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <label className="block">
        <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
          Email
        </span>
        <input
          value={email}
          disabled
          className="mt-1.5 w-full border border-border bg-cream-2 px-4 py-2.5 font-sans text-sm text-charcoal/60"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom" type="text" value={firstName} onChange={setFirstName} />
        <Field label="Nom" type="text" value={lastName} onChange={setLastName} />
      </div>

      <Field
        label="Téléphone"
        type="tel"
        value={phone}
        onChange={setPhone}
        required={false}
      />

      {message ? <p className="font-sans text-sm text-charcoal/70">{message}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 bg-ink px-6 py-3 font-sans text-sm text-cream transition-colors hover:bg-gold disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
