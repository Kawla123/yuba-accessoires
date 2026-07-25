import { User } from "@phosphor-icons/react/ssr";
import { Link } from "@/i18n/navigation";

export function AccountLink({ label }: { label: string }) {
  return (
    <Link
      href="/compte"
      aria-label={label}
      className="text-current hover:text-gold"
    >
      <User size={20} />
    </Link>
  );
}
