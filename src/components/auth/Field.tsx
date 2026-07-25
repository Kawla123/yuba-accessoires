export function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-sans text-xs tracking-wide text-charcoal/70 uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 w-full border border-border bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-gold"
      />
    </label>
  );
}
