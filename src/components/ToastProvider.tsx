"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { useToastStore } from "@/lib/toast/store";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AUTO_DISMISS_MS = 3500;

export function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            message={toast.message}
            actionLabel={toast.actionLabel}
            actionHref={toast.actionHref}
            reducedMotion={reducedMotion}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  message,
  actionLabel,
  actionHref,
  reducedMotion,
  onDismiss,
}: {
  message: string;
  actionLabel?: string;
  actionHref?: string;
  reducedMotion: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto flex items-center gap-4 bg-ink px-5 py-3 font-sans text-sm text-cream shadow-lg"
    >
      <span>{message}</span>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="text-gold underline underline-offset-4 hover:text-gold-dim">
          {actionLabel}
        </Link>
      ) : null}
    </motion.div>
  );
}
