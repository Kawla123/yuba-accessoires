const ITEMS = [
  "Acier inoxydable",
  "Livraison sous 3-4 jours",
  "Retrait en boutique à Djerba",
  "Retours sous 7 jours",
];

export function HouseTicker() {
  return (
    <div className="overflow-hidden border-y border-border bg-ink py-4">
      <div className="animate-ticker flex w-max">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex flex-none items-center gap-8 px-4 font-sans text-xs tracking-[0.3em] text-cream uppercase"
          >
            {item}
            <span className="h-1 w-1 flex-none bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
