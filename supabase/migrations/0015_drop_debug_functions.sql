-- Retrait des fonctions de diagnostic temporaires (0012-0014), plus
-- nécessaires une fois la cause du problème RLS sur "orders" identifiée.
drop function if exists public.debug_get_policies(text);
drop function if exists public.debug_whoami();
drop function if exists public.debug_check_expr();
