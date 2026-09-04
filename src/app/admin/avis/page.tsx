import { Star } from "@phosphor-icons/react/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { ReviewModerationActions } from "@/components/admin/ReviewModerationActions";

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  products: { name_fr: string; slug: string } | null;
};

export default async function AdminReviewsPage() {
  const supabase = createAdminClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, customer_name, rating, comment, is_approved, created_at, products(name_fr, slug)")
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<ReviewRow[]>();

  const pendingCount = (reviews ?? []).filter((r) => !r.is_approved).length;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
      <h1 className="font-serif text-3xl text-ink">Avis clients</h1>
      <p className="mt-1 font-sans text-sm text-charcoal/60">
        {pendingCount > 0
          ? `${pendingCount} avis en attente de modération.`
          : "Aucun avis en attente."}
      </p>

      {error ? (
        <p className="mt-8 font-sans text-sm text-red-700">
          Impossible de charger les avis : {error.message}
        </p>
      ) : null}

      <div className="mt-6 divide-y divide-border border border-border bg-cream">
        {(reviews ?? []).map((review) => (
          <div key={review.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} weight={i < review.rating ? "fill" : "regular"} />
                  ))}
                </div>
                <span className="font-sans text-xs text-charcoal/50">
                  {new Date(review.created_at).toLocaleDateString("fr-FR")}
                </span>
                {!review.is_approved ? (
                  <span className="bg-gold/20 px-2 py-0.5 font-sans text-[11px] text-ink uppercase">
                    En attente
                  </span>
                ) : null}
              </div>
              {review.comment ? (
                <p className="mt-1.5 font-sans text-sm text-charcoal/80">“{review.comment}”</p>
              ) : null}
              <p className="mt-1.5 font-sans text-xs text-charcoal/60">
                {review.customer_name} · {review.products?.name_fr ?? "Produit supprimé"}
              </p>
            </div>

            <ReviewModerationActions reviewId={review.id} isApproved={review.is_approved} />
          </div>
        ))}

        {(reviews ?? []).length === 0 ? (
          <p className="px-5 py-8 font-sans text-sm text-charcoal/60">Aucun avis pour le moment.</p>
        ) : null}
      </div>
    </main>
  );
}
