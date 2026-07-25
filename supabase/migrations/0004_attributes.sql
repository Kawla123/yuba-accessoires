-- Attributs = filtres (matière, couleur). Le prix n'est jamais un attribut :
-- les tranches de prix se calculent à la volée depuis products.price_tnd.

create table attributes (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('matiere', 'couleur')),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_fr text not null,
  name_en text,
  name_ar text,
  position integer not null default 0,
  unique (type, slug)
);

create table product_attributes (
  product_id uuid not null references products (id) on delete cascade,
  attribute_id uuid not null references attributes (id) on delete cascade,
  primary key (product_id, attribute_id)
);

create index product_attributes_attribute_id_idx
  on product_attributes (attribute_id);

-- Seed : matières.
insert into attributes (type, slug, name_fr, position) values
  ('matiere', 'or', 'Or', 0),
  ('matiere', 'plaque-or', 'Plaqué or', 1),
  ('matiere', 'argent', 'Argent', 2),
  ('matiere', 'acier', 'Acier', 3),
  ('matiere', 'cuir', 'Cuir', 4),
  ('matiere', 'perles', 'Perles', 5),
  ('matiere', 'pierre-naturelle', 'Pierre naturelle', 6),
  ('matiere', 'tissu', 'Tissu', 7);

-- Seed : couleurs.
insert into attributes (type, slug, name_fr, position) values
  ('couleur', 'dore', 'Doré', 0),
  ('couleur', 'argente', 'Argenté', 1),
  ('couleur', 'noir', 'Noir', 2),
  ('couleur', 'blanc', 'Blanc', 3),
  ('couleur', 'multicolore', 'Multicolore', 4);
