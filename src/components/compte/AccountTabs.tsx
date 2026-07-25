"use client";

import { useState } from "react";
import { ShoppingBag, User, MapPin, type LucideIcon } from "lucide-react";
import { OrderList } from "./OrderList";
import { ProfileForm } from "./ProfileForm";
import { AddressForm } from "./AddressForm";
import { AccountLogoutButton } from "./AccountLogoutButton";
import type { OrderWithItems } from "@/lib/queries/orders";

type Tab = "commandes" | "infos" | "adresses";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "commandes", label: "Mes commandes", icon: ShoppingBag },
  { id: "infos", label: "Mes informations", icon: User },
  { id: "adresses", label: "Adresses", icon: MapPin },
];

export function AccountTabs({
  locale,
  email,
  profile,
  orders,
}: {
  locale: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    shippingAddress: string;
    city: string;
    governorate: string;
  };
  orders: OrderWithItems[];
}) {
  const [tab, setTab] = useState<Tab>("commandes");

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
      <nav className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 md:hidden">
        {TABS.map((t) => (
          <MobileTabChip
            key={t.id}
            active={tab === t.id}
            label={t.label}
            icon={t.icon}
            onClick={() => setTab(t.id)}
          />
        ))}
      </nav>

      <nav className="hidden w-56 flex-none flex-col gap-1 md:flex">
        {TABS.map((t) => (
          <SidebarItem
            key={t.id}
            active={tab === t.id}
            label={t.label}
            icon={t.icon}
            onClick={() => setTab(t.id)}
          />
        ))}
        <div className="mt-4 border-t border-border pt-4">
          <AccountLogoutButton locale={locale} />
        </div>
      </nav>

      <div className="min-w-0 flex-1">
        {tab === "commandes" ? <OrderList orders={orders} /> : null}
        {tab === "infos" ? (
          <ProfileForm
            email={email}
            initial={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
            }}
          />
        ) : null}
        {tab === "adresses" ? (
          <AddressForm
            initial={{
              shippingAddress: profile.shippingAddress,
              city: profile.city,
              governorate: profile.governorate,
            }}
          />
        ) : null}
      </div>

      <div className="md:hidden">
        <AccountLogoutButton locale={locale} />
      </div>
    </div>
  );
}

function SidebarItem({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 border-l-2 px-3 py-2.5 text-left font-sans text-sm transition-colors ${
        active
          ? "border-gold text-ink"
          : "border-transparent text-charcoal/60 hover:text-ink"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function MobileTabChip({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-none snap-start items-center gap-2 border px-4 py-2 font-sans text-sm whitespace-nowrap transition-colors ${
        active
          ? "border-ink bg-ink text-cream"
          : "border-border bg-cream text-charcoal/70"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
