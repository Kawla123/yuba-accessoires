"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { approveReview, rejectReview, unpublishReview } from "@/app/admin/avis/actions";

export function ReviewModerationActions({
  reviewId,
  isApproved,
}: {
  reviewId: string;
  isApproved: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  function handleReject() {
    if (!confirm("Supprimer définitivement cet avis ?")) return;
    run(() => rejectReview(reviewId));
  }

  return (
    <div className="flex items-center gap-3">
      {pending ? <Loader2 className="h-4 w-4 animate-spin text-charcoal/50" /> : null}

      {isApproved ? (
        <button
          type="button"
          onClick={() => run(() => unpublishReview(reviewId))}
          disabled={pending}
          className="font-sans text-xs text-charcoal/70 underline hover:text-ink disabled:opacity-50"
        >
          Dépublier
        </button>
      ) : (
        <button
          type="button"
          onClick={() => run(() => approveReview(reviewId))}
          disabled={pending}
          className="font-sans text-xs text-ink underline hover:text-gold disabled:opacity-50"
        >
          Approuver
        </button>
      )}

      <button
        type="button"
        onClick={handleReject}
        disabled={pending}
        className="font-sans text-xs text-red-700 underline hover:text-red-900 disabled:opacity-50"
      >
        Rejeter
      </button>
    </div>
  );
}
