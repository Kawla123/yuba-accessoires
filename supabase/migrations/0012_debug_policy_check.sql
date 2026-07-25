-- Migration de diagnostic temporaire — à retirer une fois le problème
-- RLS sur "orders" identifié et corrigé.
create or replace function public.debug_get_policies(target_table text)
returns table (policyname text, cmd text, roles text[], qual text, with_check text)
language sql
security definer
set search_path = public
as $$
  select polname, case polcmd when 'r' then 'select' when 'a' then 'insert' when 'w' then 'update' when 'd' then 'delete' else '*' end,
    (select array_agg(rolname) from pg_roles where oid = any(polroles)),
    pg_get_expr(polqual, polrelid),
    pg_get_expr(polwithcheck, polrelid)
  from pg_policy
  where polrelid = target_table::regclass;
$$;
