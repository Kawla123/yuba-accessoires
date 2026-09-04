import Link from "next/link";
import { Star } from "@phosphor-icons/react/ssr";
import { ProductReviewForm } from "@/components/shop/ProductReviewForm";
import type { ProductReview, ReviewFormState } from "@/lib/queries/reviews";

export function ProductReviewsSection({
  locale,
  slug,
  productId,
  reviews,
  formState,
}: {
  locale: string;
  slug: string;
  productId: string;
  reviews: ProductReview[];
  formState: ReviewFormState;
}) {
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mx-auto max-w-5xl border-t border-border px-6 py-16 sm:px-10">
      <div className="flex items-baseline gap-3">
        <h2 className="font-serif text-2xl text-ink italic">Avis clients</h2>
        {reviews.length > 0 ? (
          <span className="font-sans text-sm text-charcoal/60">
            {average.toFixed(1)}/5 · {reviews.length} avis
          </span>
        ) : null}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 font-sans text-sm text-charcoal/50 italic">
          Aucun avis pour ce produit pour le moment.
        </p>
      ) : (
        <ul className="mt-6 space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="border-t border-border pt-5 first:border-t-0 first:pt-0">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} weight={i < review.rating ? "fill" : "regular"} />
                ))}
              </div>
              {review.comment ? (
                <p className="mt-2 font-sans text-sm text-charcoal/80">“{review.comment}”</p>
              ) : null}
              <p className="mt-2 font-sans text-xs tracking-wide text-charcoal/50 uppercase">
                {review.customerName}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 border-t border-border pt-8">
        {formState.status === "can_review" ? (
          <ProductReviewForm locale={locale} slug={slug} productId={productId} />
        ) : formState.status === "logged_out" ? (
          <p className="font-sans text-sm text-charcoal/70">
            <Link href={`/${locale}/connexion`} className="text-ink underline hover:text-gold">
              Connecte-toi
            </Link>{" "}
            pour laisser un avis si tu as déjà acheté ce produit.
          </p>
        ) : formState.status === "not_purchased" ? (
          <p className="font-sans text-sm text-charcoal/50 italic">
            Seuls les clients ayant acheté ce produit peuvent laisser un avis.
          </p>
        ) : formState.status === "pending_moderation" ? (
          <p className="font-sans text-sm text-charcoal/50 italic">
            Ton avis a été envoyé et est en attente de modération. Merci !
          </p>
        ) : (
          <p className="font-sans text-sm text-charcoal/50 italic">
            Tu as déjà laissé un avis pour ce produit. Merci !
          </p>
        )}
      </div>
    </section>
  );
}
