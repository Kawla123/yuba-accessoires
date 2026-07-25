"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart/store";
import { formatTND } from "@/lib/format";
import {
  shippingAddressSchema,
  GOVERNORATES,
  type ShippingAddressInput,
} from "@/lib/validation/checkout";
import { createOrder } from "@/app/[locale]/commande/actions";
import { Field } from "@/components/auth/Field";

type Step = 1 | 2 | 3;

const EMPTY_ADDRESS: ShippingAddressInput = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  shippingAddress: "",
  city: "",
  governorate: GOVERNORATES[0],
};

export function CheckoutFlow({
  locale,
  paymentFailed,
}: {
  locale: string;
  paymentFailed: boolean;
}) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [step, setStep] = useState<Step>(paymentFailed ? 3 : 1);
  const [address, setAddress] = useState<ShippingAddressInput>(EMPTY_ADDRESS);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "konnect">("cod");
  const [submitError, setSubmitError] = useState<string | null>(
    paymentFailed
      ? "Le paiement en ligne a échoué ou a été annulé. Réessaie, ou choisis le paiement à la livraison."
      : null,
  );
  const [pending, setPending] = useState(false);

  if (!hydrated) return null;

  if (items.length === 0 && !pending) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-serif text-2xl text-ink">Ton panier est vide</p>
        <button
          type="button"
          onClick={() => router.push("/boutique")}
          className="bg-ink px-6 py-3 font-sans text-sm text-cream hover:bg-gold"
        >
          Découvrir la boutique
        </button>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = shippingAddressSchema.safeParse(address);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[String(issue.path[0])] = issue.message;
      }
      setAddressErrors(errors);
      return;
    }
    setAddressErrors({});
    setStep(3);
  }

  async function handlePlaceOrder() {
    setSubmitError(null);
    setPending(true);

    const result = await createOrder({
      locale,
      address,
      paymentMethod,
      items: items.map((i) => ({
        productSlug: i.productSlug,
        variantId: i.variantId,
        name: i.name,
        priceTnd: i.priceTnd,
        quantity: i.quantity,
      })),
    });

    if (!result.ok) {
      setPending(false);
      setSubmitError(result.error);
      return;
    }

    if (paymentMethod === "cod") {
      clearCart();
      router.push(result.redirectUrl);
    } else {
      // Redirection externe vers la page de paiement Konnect : le panier
      // n'est vidé qu'une fois le paiement confirmé (page de confirmation).
      window.location.href = result.redirectUrl;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <ol className="mb-10 flex items-center gap-3 font-sans text-xs tracking-wide text-charcoal/60 uppercase">
        <StepLabel active={step === 1} done={step > 1} label="Panier" />
        <span>—</span>
        <StepLabel active={step === 2} done={step > 2} label="Adresse" />
        <span>—</span>
        <StepLabel active={step === 3} done={false} label="Paiement" />
      </ol>

      {step === 1 ? (
        <div>
          <h1 className="font-serif text-3xl text-ink">Récapitulatif</h1>
          <ul className="mt-6 divide-y divide-border">
            {items.map((item) => (
              <li
                key={`${item.productSlug}-${item.variantId ?? ""}`}
                className="flex items-center justify-between py-3 font-sans text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatTND(item.priceTnd * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="font-sans text-sm text-charcoal/70">
              Sous-total
            </span>
            <span className="font-serif text-xl text-ink">
              {formatTND(subtotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-8 w-full bg-ink px-6 py-3.5 font-sans text-sm text-cream hover:bg-gold"
          >
            Continuer
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <form onSubmit={handleAddressSubmit}>
          <h1 className="font-serif text-3xl text-ink">
            Adresse de livraison
          </h1>
          <div className="mt-6 space-y-5">
            <Field
              label="Nom complet"
              type="text"
              value={address.customerName}
              onChange={(v) => setAddress({ ...address, customerName: v })}
            />
            {addressErrors.customerName ? (
              <ErrorText text={addressErrors.customerName} />
            ) : null}

            <Field
              label="Téléphone"
              type="tel"
              value={address.customerPhone}
              onChange={(v) => setAddress({ ...address, customerPhone: v })}
            />
            {addressErrors.customerPhone ? (
              <ErrorText text={addressErrors.customerPhone} />
            ) : null}

            <Field
              label="Email (optionnel, pour la confirmation)"
              type="email"
              value={address.customerEmail ?? ""}
              onChange={(v) => setAddress({ ...address, customerEmail: v })}
              required={false}
            />

            <Field
              label="Adresse"
              type="text"
              value={address.shippingAddress}
              onChange={(v) => setAddress({ ...address, shippingAddress: v })}
            />
            {addressErrors.shippingAddress ? (
              <ErrorText text={addressErrors.shippingAddress} />
            ) : null}

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Ville"
                type="text"
                value={address.city}
                onChange={(v) => setAddress({ ...address, city: v })}
              />
              <label className="block">
                <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
                  Gouvernorat
                </span>
                <select
                  value={address.governorate}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      governorate: e.target
                        .value as ShippingAddressInput["governorate"],
                    })
                  }
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
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border border-ink px-6 py-3.5 font-sans text-sm text-ink hover:border-gold hover:text-gold"
            >
              Retour
            </button>
            <button
              type="submit"
              className="flex-1 bg-ink px-6 py-3.5 font-sans text-sm text-cream hover:bg-gold"
            >
              Continuer
            </button>
          </div>
        </form>
      ) : null}

      {step === 3 ? (
        <div>
          <h1 className="font-serif text-3xl text-ink">Paiement</h1>

          <div className="mt-6 space-y-3">
            <PaymentOption
              value="cod"
              selected={paymentMethod === "cod"}
              onSelect={() => setPaymentMethod("cod")}
              title="Paiement à la livraison"
              description="Payez en espèces à la réception. Un appel ou SMS confirmera la commande avant expédition."
            />
            <PaymentOption
              value="konnect"
              selected={paymentMethod === "konnect"}
              onSelect={() => setPaymentMethod("konnect")}
              title="Paiement en ligne (Konnect)"
              description="Carte bancaire, e-DINAR ou wallet — paiement sécurisé via Konnect."
            />
          </div>

          {submitError ? <ErrorText text={submitError} className="mt-4" /> : null}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
            <span className="font-sans text-sm text-charcoal/70">Total</span>
            <span className="font-serif text-xl text-ink">
              {formatTND(subtotal)}
            </span>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border border-ink px-6 py-3.5 font-sans text-sm text-ink hover:border-gold hover:text-gold"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={pending}
              className="flex-1 bg-ink px-6 py-3.5 font-sans text-sm text-cream hover:bg-gold disabled:opacity-60"
            >
              {pending
                ? "Traitement…"
                : paymentMethod === "cod"
                  ? "Confirmer la commande"
                  : "Payer en ligne"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StepLabel({
  active,
  done,
  label,
}: {
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <li className={active ? "text-gold" : done ? "text-ink" : ""}>{label}</li>
  );
}

function ErrorText({ text, className }: { text: string; className?: string }) {
  return (
    <p className={`font-sans text-sm text-red-700 ${className ?? ""}`}>{text}</p>
  );
}

function PaymentOption({
  value,
  selected,
  onSelect,
  title,
  description,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full border px-5 py-4 text-left transition-colors ${
        selected ? "border-gold bg-cream-2" : "border-border"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`h-4 w-4 flex-none rounded-full border ${
            selected ? "border-gold bg-gold" : "border-charcoal/40"
          }`}
        />
        <span className="font-sans text-sm text-ink">{title}</span>
      </span>
      <span className="mt-1 block pl-7 font-sans text-xs text-charcoal/60">
        {description}
      </span>
      <input type="radio" name="payment" value={value} checked={selected} readOnly hidden />
    </button>
  );
}
