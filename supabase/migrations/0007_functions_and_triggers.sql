-- Génération automatique d'un numéro de commande lisible (ex: YUBA-000042).

create sequence order_number_seq start 1;

-- SECURITY DEFINER : le client (anon/authenticated) qui passe commande n'a
-- pas de droit direct sur order_number_seq, seul le propriétaire de la
-- fonction en a besoin pour générer le numéro.
create or replace function set_order_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.order_number is null then
    new.order_number := 'YUBA-' || lpad(nextval('order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger orders_set_order_number
  before insert on orders
  for each row
  execute function set_order_number();

-- Garde-fou côté serveur : impossible d'activer une catégorie tant qu'elle
-- compte moins de 4 produits actifs. Le back-office doit aussi bloquer ce
-- cas dans son interface, mais cette contrainte est la source de vérité :
-- elle s'applique même à un appel direct à l'API Supabase.

create or replace function enforce_category_min_active_products()
returns trigger
language plpgsql
as $$
declare
  active_product_count integer;
begin
  select count(*) into active_product_count
  from products
  where category_id = new.id and is_active = true;

  if active_product_count < 4 then
    raise exception
      'Cette catégorie a besoin d''au moins 4 produits avant d''être publiée.';
  end if;

  return new;
end;
$$;

create trigger categories_enforce_min_active_products
  before insert or update on categories
  for each row
  when (new.is_active = true)
  execute function enforce_category_min_active_products();
