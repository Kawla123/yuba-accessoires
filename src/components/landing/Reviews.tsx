import { Star } from "@phosphor-icons/react/ssr";
import type { LandingReview } from "@/lib/queries/landing";

// Fond clair, homogène avec le reste du site (palette crème/blush chaude).
export function Reviews({ reviews }: { reviews: LandingReview[] }) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
        <h2 className="font-serif text-3xl text-ink italic sm:text-4xl">
          Elles portent Yuba
        </h2>

        {reviews.length === 0 ? (
          <p className="mt-10 font-sans text-sm text-charcoal/50 italic">
            Les premiers avis arrivent bientôt.
          </p>
        ) : (
          // flex-wrap + justify-center plutôt qu'une grille à colonnes
          // fixes : avec 1 ou 2 avis, une grille à 3 colonnes laisserait
          // des cellules vides visibles — ici chaque ligne se centre
          // d'elle-même, quel que soit le nombre d'avis.
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-full border-t border-border pt-5 sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
              >
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      weight={i < review.rating ? "fill" : "regular"}
                    />
                  ))}
                </div>
                {review.comment ? (
                  <p className="mt-3 font-sans text-sm text-charcoal/80">
                    “{review.comment}”
                  </p>
                ) : null}
                <p className="mt-3 font-sans text-xs tracking-wide text-charcoal/50 uppercase">
                  {review.customerName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
