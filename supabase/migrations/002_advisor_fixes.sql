-- =====================================================================
-- Corrections des alertes Supabase Advisors (sécurité & performance).
-- À exécuter dans SQL Editor sur une base où schema.sql a déjà tourné.
-- Idempotent. schema.sql intègre déjà ces corrections pour une installation neuve.
-- =====================================================================

-- [Sécurité] function_search_path_mutable
create or replace function public.slot_capacity()
returns integer
language sql
immutable
set search_path = ''
as $$ select 16 $$;

-- [Sécurité] fonctions SECURITY DEFINER exécutables via l'API.
-- Postgres accorde EXECUTE à PUBLIC par défaut : on retire ce droit partout,
-- puis on ne rend que ce qui est nécessaire.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.check_reservation_capacity() from public, anon, authenticated;
revoke execute on function public.place_order(jsonb, text, text) from public, anon;
revoke execute on function public.slot_availability(date) from public;
revoke execute on function public.is_admin() from public;
revoke execute on function public.slot_capacity() from public;

grant execute on function public.place_order(jsonb, text, text) to authenticated;
grant execute on function public.slot_availability(date) to anon, authenticated;
-- is_admin() est appelée par les politiques RLS, y compris pour les visiteurs anonymes.
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.slot_capacity() to anon, authenticated;

-- [Info] rls_enabled_no_policy
drop policy if exists "admin_emails: lecture admin" on public.admin_emails;
create policy "admin_emails: lecture admin" on public.admin_emails
  for select to authenticated using ((select public.is_admin()));

-- [Performance] auth_rls_initplan : (select …) évalue la fonction une fois par requête.
-- [Performance] multiple_permissive_policies : une seule politique UPDATE par table.
drop policy if exists "profiles: lecture" on public.profiles;
create policy "profiles: lecture" on public.profiles
  for select using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "products: lecture publique" on public.products;
create policy "products: lecture publique" on public.products
  for select using (active or (select public.is_admin()));

drop policy if exists "products: gestion admin" on public.products;
create policy "products: gestion admin" on public.products
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "orders: lecture" on public.orders;
create policy "orders: lecture" on public.orders
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "orders: gestion admin" on public.orders;
create policy "orders: gestion admin" on public.orders
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "order_items: lecture" on public.order_items;
create policy "order_items: lecture" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin()))
    )
  );

drop policy if exists "reservations: lecture" on public.reservations;
create policy "reservations: lecture" on public.reservations
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "reservations: création" on public.reservations;
create policy "reservations: création" on public.reservations
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'confirmee');

drop policy if exists "reservations: annulation client" on public.reservations;
drop policy if exists "reservations: gestion admin" on public.reservations;
drop policy if exists "reservations: modification" on public.reservations;
create policy "reservations: modification" on public.reservations
  for update to authenticated
  using (
    (select public.is_admin())
    or (user_id = (select auth.uid()) and status = 'confirmee')
  )
  with check (
    (select public.is_admin())
    or (user_id = (select auth.uid()) and status = 'annulee')
  );

-- [Performance] unindexed_foreign_keys
create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);
create index if not exists reservations_user_id_idx on public.reservations (user_id);
