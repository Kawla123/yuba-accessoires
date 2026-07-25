const points = [
  {
    title: "Acier inoxydable",
    body: "Résiste à l'eau, à la transpiration et au temps — ne ternit pas, ne noircit pas.",
  },
  {
    title: "Fabrication soignée",
    body: "Chaque pièce est contrôlée individuellement avant expédition.",
  },
  {
    title: "Garantie deux ans",
    body: "Contre tout défaut de fabrication, sans condition.",
  },
  {
    title: "Livraison suivie",
    body: "Partout en Tunisie sous 3 à 5 jours ouvrés, avec numéro de suivi.",
  },
];

export function WhyYuba() {
  return (
    <section className="px-6 py-24 sm:px-10 lg:py-32">
      <p className="max-w-3xl font-serif text-3xl text-ink italic sm:text-4xl lg:text-5xl">
        Chaque pièce Yuba est pensée pour durer&nbsp;: un acier qui résiste au
        quotidien, des finitions qui se voient — et se sentent.
      </p>

      <div className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {points.map((point) => (
          <div key={point.title} className="border-t border-border pt-6">
            <h3 className="font-serif text-xl text-gold italic">
              {point.title}
            </h3>
            <p className="mt-2 max-w-sm font-sans text-sm text-charcoal/70">
              {point.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
