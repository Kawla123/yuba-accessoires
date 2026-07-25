-- Lie une commande à un compte client quand il est connecté (checkout
-- invité toujours possible : user_id reste nul dans ce cas). Le
-- back-office continue d'utiliser la clé service_role (contourne RLS),
-- ces policies ne couvrent que l'auto-consultation par le client connecté.

alter table orders
  add column user_id uuid references profiles (id) on delete set null;

create index orders_user_id_idx on orders (user_id);

-- Un client connecté ne peut s'attribuer que ses propres commandes
-- (empêche de forger l'historique d'un autre compte) ; un invité laisse
-- user_id nul. Remplace le "with check (true)" de la policy 0008, devenu
-- possible maintenant que la colonne user_id existe.
alter policy "anyone can place an order"
  on orders
  with check (user_id is null or user_id = auth.uid());

create policy "customers can view their own orders"
  on orders for select
  to authenticated
  using (user_id = auth.uid());

create policy "customers can view their own order items"
  on order_items for select
  to authenticated
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
