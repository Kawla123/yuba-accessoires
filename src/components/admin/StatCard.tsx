import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: { direction: "up" | "down" | "flat"; label: string };
}) {
  return (
    <div className="border border-border bg-cream px-5 py-5">
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs tracking-wide text-charcoal/60 uppercase">
          {label}
        </span>
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <p className="mt-3 font-serif text-3xl text-ink">{value}</p>
      {delta ? (
        <p className="mt-1 font-sans text-xs text-charcoal/50">
          {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : "—"}{" "}
          {delta.label}
        </p>
      ) : null}
    </div>
  );
}
