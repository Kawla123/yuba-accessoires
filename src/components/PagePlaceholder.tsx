export function PagePlaceholder({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col justify-center px-6 py-24">
      <p className="font-sans text-xs tracking-[0.2em] text-gold uppercase">
        Yuba
      </p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
        {title}
      </h1>
      {note ? (
        <p className="mt-4 font-sans text-sm text-charcoal/70">{note}</p>
      ) : null}
    </div>
  );
}
