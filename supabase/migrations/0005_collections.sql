-- Collections = mises en avant éditoriales et temporaires (ex: "Nouveautés",
-- "Cadeaux"). Elles ne structurent jamais la navigation du site et ne
-- doivent pas être confondues avec les catégories : un même produit peut
-- appartenir à plusieurs collections, dans plusieurs catégories différentes.

create table collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text,
  name_ar text,
  description_fr text,
  description_en text,
  description_ar text,
  image_r2_key text,
  is_active boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table product_collections (
  product_id uuid not null references products (id) on delete cascade,
  collection_id uuid not null references collections (id) on delete cascade,
  primary key (product_id, collection_id)
);

create index product_collections_collection_id_idx
  on product_collections (collection_id);
create index collections_is_active_idx on collections (is_active);

-- Seed : collections éditoriales, inactives par défaut.
insert into collections (slug, name_fr, position, is_active) values
  ('nouveautes', 'Nouveautés', 0, false),
  ('coups-de-coeur', 'Coups de cœur', 1, false),
  ('cadeaux', 'Cadeaux', 2, false),
  ('fait-main-djerba', 'Fait main à Djerba', 3, false);
