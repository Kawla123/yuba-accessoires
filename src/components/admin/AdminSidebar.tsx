"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Star,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/avis", label: "Avis", icon: Star },
  { href: "/admin/clients", label: "Clients", icon: Users },
];

export function AdminSidebar({
  newOrdersCount,
  pendingReviewsCount,
}: {
  newOrdersCount: number;
  pendingReviewsCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Barre mobile */}
      <div className="flex h-14 items-center justify-between border-b border-cream/10 bg-ink-2 px-5 md:hidden">
        <span className="font-serif text-lg text-cream italic">Yuba Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="text-cream"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/60"
          />
          <div className="relative flex h-full w-64 flex-col bg-ink-2 px-4 py-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-serif text-lg text-cream italic">Yuba Admin</span>
              <button type="button" onClick={() => setOpen(false)} className="text-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav
              items={NAV_ITEMS}
              isActive={isActive}
              newOrdersCount={newOrdersCount}
              pendingReviewsCount={pendingReviewsCount}
              onNavigate={() => setOpen(false)}
            />
            <div className="mt-auto border-t border-cream/10 pt-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      ) : null}

      {/* Sidebar fixe desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-2 px-4 py-6 md:flex">
        <Link href="/admin" className="mb-8 px-2 font-serif text-xl text-cream italic">
          Yuba Admin
        </Link>
        <SidebarNav
          items={NAV_ITEMS}
          isActive={isActive}
          newOrdersCount={newOrdersCount}
          pendingReviewsCount={pendingReviewsCount}
        />
        <div className="mt-auto border-t border-cream/10 pt-4">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

function SidebarNav({
  items,
  isActive,
  newOrdersCount,
  pendingReviewsCount,
  onNavigate,
}: {
  items: typeof NAV_ITEMS;
  isActive: (href: string) => boolean;
  newOrdersCount: number;
  pendingReviewsCount: number;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(item.href);
        const badgeCount =
          item.href === "/admin/commandes"
            ? newOrdersCount
            : item.href === "/admin/avis"
              ? pendingReviewsCount
              : 0;
        const showBadge = badgeCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors ${
              active
                ? "bg-cream/10 text-cream"
                : "text-cream/60 hover:bg-cream/5 hover:text-cream"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {showBadge ? (
              <span className="flex h-5 min-w-5 items-center justify-center bg-gold px-1.5 font-sans text-xs text-ink">
                {badgeCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
