-- Profils client, liés à Supabase Auth (auth.users). Un profil est créé
-- automatiquement à l'inscription ; l'email admin reçoit le rôle admin
-- dès la création de son compte, aucune autre action manuelle requise.

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  default_shipping_address text,
  default_city text,
  default_governorate text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- Fonction SECURITY DEFINER : évite la récursion RLS si on vérifiait le
-- rôle admin via une sous-requête directe sur profiles dans sa propre
-- policy (piège classique). Bypass RLS volontaire et contrôlé.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    case
      when new.email = 'khaoula.isims@gmail.com' then 'admin'
      else 'customer'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

alter table profiles enable row level security;

create policy "users can view their own profile, admins view all"
  on profiles for select
  to authenticated
  using (id = auth.uid() or is_admin());

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
