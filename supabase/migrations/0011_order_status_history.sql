-- Historique des changements de statut, affiché dans le détail commande
-- admin. Écriture réservée au service_role (back-office) ; pas de policy
-- publique, ces lignes ne sont jamais lues côté client.

create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  status order_status not null,
  created_at timestamptz not null default now()
);

create index order_status_history_order_id_idx on order_status_history (order_id);

alter table order_status_history enable row level security;

-- La création de commande (checkout invité inclus) insère la première
-- entrée d'historique ("pending_confirmation") avec la clé anon : il faut
-- donc une policy d'insertion, comme pour orders/order_items en 0008.
-- Aucune lecture publique : consultée uniquement par le back-office
-- (service_role, qui contourne RLS).
create policy "anyone can log the initial order status"
  on order_status_history for insert
  to anon, authenticated
  with check (true);
