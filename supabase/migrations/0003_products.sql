-- Produits, images, variantes. Tous les prix sont des entiers (plus petite
-- unité monétaire), jamais des nombres flottants.
--
-- Le genre est un attribut du PRODUIT, pas de la catégorie : un produit
-- 'mixte' apparaît à la fois dans /femme et /homme sans dupliquer sa
-- catégorie. La matière n'est plus un champ texte libre ici : elle est
-- désormais un attribut structuré (voir 0004_attributes.sql), pour rester
-- filtrable et cohérente avec la couleur.

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_fr text not null,
  name_en text,
  name_ar text,
  description_fr text,
  description_en text,
  description_ar text,
  price_tnd integer not null check (price_tnd >= 0),
  compare_at_price_tnd integer check (compare_at_price_tnd >= 0),
  category_id uuid references categories (id) on delete set null,
  gender text not null default 'femme' check (gender in ('femme', 'homme', 'mixte')),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default false,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  weight_grams integer check (weight_grams >= 0),
  created_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  r2_key text not null,
  alt_fr text,
  alt_en text,
  alt_ar text,
  position integer not null default 0
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  name text not null,
  sku text unique,
  price_delta integer not null default 0,
  stock_quantity integer not null default 0 check (stock_quantity >= 0)
);

create index products_category_id_idx on products (category_id);
create index products_is_active_idx on products (is_active);
create index products_is_featured_idx on products (is_featured) where is_featured;
create index products_is_new_idx on products (is_new) where is_new;
-- Index composé demandé pour les listings /[gender]/[categorySlug].
create index products_gender_category_active_idx
  on products (gender, category_id, is_active);
create index product_images_product_id_idx on product_images (product_id);
create index product_variants_product_id_idx on product_variants (product_id);
