-- Migration de diagnostic temporaire — à retirer une fois le problème
-- RLS sur "orders" identifié et corrigé.
create or replace function public.debug_check_expr()
returns table (
  computed_uid uuid,
  check_with_null boolean,
  column_default text,
  is_nullable text
)
language sql
security invoker
stable
as $$
  select
    auth.uid(),
    (null::uuid is null or null::uuid = auth.uid()),
    (select column_default from information_schema.columns where table_name = 'orders' and column_name = 'user_id'),
    (select is_nullable from information_schema.columns where table_name = 'orders' and column_name = 'user_id');
$$;
