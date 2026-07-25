-- Taxonomie du catalogue : familles (regroupement de navigation, jamais
-- dans les URLs) et catégories (le type d'objet, sans notion de genre).
-- Le genre est porté par products.gender (voir 0003_products.sql), jamais
-- par la catégorie : une catégorie "bagues" contient des bagues femme,
-- homme et mixte, ce n'est pas une catégorie "bagues-femme".

create table families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text,
  name_ar text,
  position integer not null default 0
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  family_id uuid not null references families (id) on delete restrict,
  name_fr text not null,
  name_en text,
  name_ar text,
  -- Texte d'intro (2 à 4 phrases) affiché en haut de la page catégorie,
  -- déterminant pour le référencement : obligatoire avant activation.
  description_fr text,
  description_en text,
  description_ar text,
  image_r2_key text,
  position integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  constraint categories_description_required_before_active check (
    is_active = false
    or (description_fr is not null and btrim(description_fr) <> '')
  )
);

create index categories_family_id_idx on categories (family_id);
create index categories_is_active_idx on categories (is_active);

-- Seed : deux familles.
insert into families (slug, name_fr, name_en, name_ar, position) values
  ('bijoux', 'Bijoux', 'Jewelry', 'مجوهرات', 0),
  ('accessoires', 'Accessoires', 'Accessories', 'إكسسوارات', 1);

-- Seed : catégories bijoux, toutes inactives (activées manuellement une
-- fois le texte d'intro et au moins 4 produits actifs en place).
insert into categories (slug, family_id, name_fr, position, is_active)
select c.slug, f.id, c.name_fr, c.position, false
from (values
  ('colliers-et-chaines', 'Colliers et chaînes', 0),
  ('bracelets', 'Bracelets', 1),
  ('bagues', 'Bagues', 2),
  ('boucles-d-oreilles', 'Boucles d''oreilles', 3),
  ('boutons-de-manchette', 'Boutons de manchette', 4),
  ('parures', 'Parures', 5)
) as c(slug, name_fr, position)
cross join lateral (select id from families where slug = 'bijoux') as f(id);

-- Seed : catégories accessoires, toutes inactives.
insert into categories (slug, family_id, name_fr, position, is_active)
select c.slug, f.id, c.name_fr, c.position, false
from (values
  ('sacs', 'Sacs', 0),
  ('portefeuilles', 'Portefeuilles', 1),
  ('ceintures', 'Ceintures', 2),
  ('montres', 'Montres', 3),
  ('foulards', 'Foulards', 4),
  ('accessoires-cheveux', 'Accessoires cheveux', 5),
  ('porte-cles', 'Porte-clés', 6)
) as c(slug, name_fr, position)
cross join lateral (select id from families where slug = 'accessoires') as f(id);
