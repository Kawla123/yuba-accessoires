-- Migration de diagnostic temporaire — à retirer une fois le problème
-- RLS sur "orders" identifié et corrigé.
create or replace function public.debug_whoami()
returns table (uid uuid, role_name text)
language sql
security invoker
stable
as $$
  select auth.uid(), current_setting('role', true);
$$;
