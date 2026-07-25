-- Row Level Security. Le back-office utilise la clé service_role
-- (src/lib/supabase/admin.ts), qui contourne RLS : ces policies ne
-- couvrent que l'accès public (clé anon) depuis le site.

alter table families enable row level security;
alter table categories enable row level security;
alter table attributes enable row level security;
alter table product_attributes enable row level security;
alter table collections enable row level security;
alter table product_collections enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table newsletter_subscribers enable row level security;

-- Taxonomie : lecture publique, restreinte à ce qui est publié.

create policy "families are publicly readable"
  on families for select
  to anon, authenticated
  using (true);

create policy "active categories are publicly readable"
  on categories for select
  to anon, authenticated
  using (is_active = true);

create policy "attributes are publicly readable"
  on attributes for select
  to anon, authenticated
  using (true);

create policy "attributes of active products are publicly readable"
  on product_attributes for select
  to anon, authenticated
  using (
    exists (
      select 1 from products
      where products.id = product_attributes.product_id
        and products.is_active = true
    )
  );

create policy "active collections are publicly readable"
  on collections for select
  to anon, authenticated
  using (is_active = true);

create policy "active products in active collections are publicly readable"
  on product_collections for select
  to anon, authenticated
  using (
    exists (
      select 1 from collections
      where collections.id = product_collections.collection_id
        and collections.is_active = true
    )
    and exists (
      select 1 from products
      where products.id = product_collections.product_id
        and products.is_active = true
    )
  );

-- Catalogue produit : lecture publique.

create policy "active products are publicly readable"
  on products for select
  to anon, authenticated
  using (is_active = true);

create policy "images of active products are publicly readable"
  on product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
        and products.is_active = true
    )
  );

create policy "variants of active products are publicly readable"
  on product_variants for select
  to anon, authenticated
  using (
    exists (
      select 1 from products
      where products.id = product_variants.product_id
        and products.is_active = true
    )
  );

-- Commandes : création possible sans compte (checkout invité), aucune
-- lecture publique (la confirmation de commande est servie côté serveur
-- avec la clé service_role, filtrée sur order_number).

create policy "anyone can place an order"
  on orders for insert
  to anon, authenticated
  with check (true);

create policy "anyone can add items to an order"
  on order_items for insert
  to anon, authenticated
  with check (true);

-- Avis clients : lecture publique des avis approuvés uniquement, dépôt
-- d'avis toujours créé non approuvé (modération manuelle côté admin).

create policy "approved reviews are publicly readable"
  on reviews for select
  to anon, authenticated
  using (is_approved = true);

create policy "anyone can submit a review pending moderation"
  on reviews for insert
  to anon, authenticated
  with check (is_approved = false);

-- Newsletter : inscription publique, aucune lecture publique.

create policy "anyone can subscribe to the newsletter"
  on newsletter_subscribers for insert
  to anon, authenticated
  with check (true);
