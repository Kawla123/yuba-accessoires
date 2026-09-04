"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { StarRatingInput } from "@/components/shop/StarRatingInput";
import { useToastStore } from "@/lib/toast/store";
import { submitReview } from "@/app/[locale]/produit/[slug]/actions";

export function ProductReviewForm({
  locale,
  slug,
  productId,
}: {
  locale: string;
  slug: string;
  productId: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const showToast = useToastStore((s) => s.show);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Choisis une note.");
      return;
    }
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.set("rating", String(rating));
    formData.set("comment", comment);

    const result = await submitReview(locale, slug, productId, formData);
    setPending(false);

    if (result.ok) {
      setSubmitted(true);
      showToast("Merci pour ton avis ✓");
    } else {
      setError(result.error);
    }
  }

  if (submitted) {
    return (
      <p className="font-sans text-sm text-charcoal/70">
        Merci, ton avis a bien été envoyé et sera publié après modération.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <p className="mb-1.5 font-sans text-xs tracking-wide text-charcoal/70 uppercase">
          Ta note
        </p>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>

      <label className="block">
        <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
          Ton avis (optionnel)
        </span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          className="mt-1.5 w-full resize-none border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
        />
      </label>

      {error ? <p className="font-sans text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 bg-ink px-6 py-3 font-sans text-sm text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Envoi…" : "Envoyer mon avis"}
      </button>
    </form>
  );
}
