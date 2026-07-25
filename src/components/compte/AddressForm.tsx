"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Field } from "@/components/auth/Field";
import { GOVERNORATES } from "@/lib/validation/checkout";
import { updateAddress } from "@/app/[locale]/compte/actions";

export function AddressForm({
  initial,
}: {
  initial: { shippingAddress: string; city: string; governorate: string };
}) {
  const [shippingAddress, setShippingAddress] = useState(initial.shippingAddress);
  const [city, setCity] = useState(initial.city);
  const [governorate, setGovernorate] = useState(
    initial.governorate || GOVERNORATES[0],
  );
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("shippingAddress", shippingAddress);
    formData.set("city", city);
    formData.set("governorate", governorate);

    const result = await updateAddress(formData);
    setPending(false);
    setMessage(result.ok ? "Adresse enregistrée." : result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <Field
        label="Adresse"
        type="text"
        value={shippingAddress}
        onChange={setShippingAddress}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ville" type="text" value={city} onChange={setCity} />
        <label className="block">
          <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
            Gouvernorat
          </span>
          <select
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
          >
            {GOVERNORATES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
      </div>

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
