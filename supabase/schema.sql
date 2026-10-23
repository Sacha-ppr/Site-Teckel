-- =====================================================================
-- Le Bar à Teckels — schéma Supabase
-- À exécuter une fois dans Supabase > SQL Editor (idempotent).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Profils & rôles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

-- Emails qui reçoivent automatiquement le rôle admin à l'inscription.
create table if not exists public.admin_emails (
  email text primary key
);

insert into public.admin_emails (email)
values ('josephhalle992@gmail.com'), ('josephhalle@hotmail.com')
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    case
      when exists (select 1 from public.admin_emails where lower(email) = lower(new.email))
        then 'admin'
      else 'client'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Boutique
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  category text not null check (category in ('vetements', 'jouets', 'friandises', 'accessoires')),
  price_cents integer not null check (price_cents >= 0),
  stock integer not null default 0 check (stock >= 0),
  color text not null default '#b5652b',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'payee' check (status in ('payee', 'preparation', 'expediee', 'annulee')),
  total_cents integer not null,
  shipping_cents integer not null default 0,
  shipping_name text not null,
  shipping_address text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_id bigint not null references public.products (id),
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null
);

-- Passe une commande : les prix sont relus en base, jamais pris du client.
create or replace function public.place_order(
  items jsonb,
  shipping_name text,
  shipping_address text
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id bigint;
  v_total integer := 0;
  v_item jsonb;
  v_product public.products;
  v_qty integer;
begin
  if auth.uid() is null then
    raise exception 'Connexion requise';
  end if;
  if jsonb_array_length(items) = 0 then
    raise exception 'Panier vide';
  end if;

  insert into public.orders (user_id, total_cents, shipping_name, shipping_address)
  values (auth.uid(), 0, shipping_name, shipping_address)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(items) loop
    v_qty := (v_item ->> 'quantity')::integer;
    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::bigint and active
      for update;
    if not found then
      raise exception 'Produit introuvable';
    end if;
    if v_qty < 1 or v_product.stock < v_qty then
      raise exception 'Stock insuffisant pour %', v_product.name;
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_cents)
    values (v_order_id, v_product.id, v_product.name, v_qty, v_product.price_cents);
    v_total := v_total + v_qty * v_product.price_cents;
  end loop;

  -- Livraison offerte dès 60 €, sinon 5,90 € (aligné sur app/(site)/panier/checkout.tsx).
  update public.orders
  set shipping_cents = case when v_total >= 6000 then 0 else 590 end,
      total_cents = v_total + case when v_total >= 6000 then 0 else 590 end
  where id = v_order_id;
  return v_order_id;
end;
$$;

-- ---------------------------------------------------------------------
-- Bar à teckels : réservations
-- ---------------------------------------------------------------------
create table if not exists public.reservations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  contact_name text not null,
  phone text,
  date date not null,
  slot text not null check (slot in ('10:00', '12:00', '14:00', '16:00', '18:00')),
  guests integer not null check (guests between 1 and 6),
  formula text not null check (formula in ('cafe-calin', 'gouter-teckel', 'apero-saucisse')),
  with_own_dog boolean not null default false,
  notes text,
  status text not null default 'confirmee' check (status in ('confirmee', 'arrivee', 'annulee', 'absente')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_date_slot_idx on public.reservations (date, slot);

-- Capacité d'un créneau (nombre de places assises).
create or replace function public.slot_capacity()
returns integer
language sql
immutable
set search_path = ''
as $$ select 16 $$;

-- Places restantes par créneau pour une date : visible de tous sans
-- exposer les réservations des autres clients.
create or replace function public.slot_availability(p_date date)
returns table (slot text, remaining integer)
language sql
stable
security definer
set search_path = public
as $$
  select s.slot,
         public.slot_capacity() - coalesce(sum(r.guests), 0)::integer
  from unnest(array['10:00', '12:00', '14:00', '16:00', '18:00']) as s(slot)
  left join public.reservations r
    on r.slot = s.slot and r.date = p_date and r.status <> 'annulee'
  group by s.slot
  order by s.slot;
$$;

create or replace function public.check_reservation_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booked integer;
begin
  if new.status = 'annulee' then
    return new;
  end if;
  if tg_op = 'INSERT' and new.date < current_date then
    raise exception 'Impossible de réserver dans le passé';
  end if;

  -- Verrou par créneau pour éviter le surbooking concurrent.
  perform pg_advisory_xact_lock(hashtext(new.date::text || new.slot));

  select coalesce(sum(guests), 0) into v_booked
  from public.reservations
  where date = new.date and slot = new.slot and status <> 'annulee'
    and id is distinct from new.id;

  if v_booked + new.guests > public.slot_capacity() then
    raise exception 'Ce créneau est complet';
  end if;
  return new;
end;
$$;

drop trigger if exists reservations_capacity on public.reservations;
create trigger reservations_capacity
  before insert or update on public.reservations
  for each row execute function public.check_reservation_capacity();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.admin_emails enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reservations enable row level security;

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

-- ---------------------------------------------------------------------
-- Catalogue de départ
-- ---------------------------------------------------------------------
insert into public.products (slug, name, description, category, price_cents, stock, color) values
  ('manteau-saucisse', 'Manteau « Saucisse au chaud »', 'Manteau matelassé coupé pour les dos longs, doublure polaire et fermeture ventrale.', 'vetements', 4900, 25, '#9c4a1a'),
  ('pull-marin', 'Pull marinière', 'Maille côtelée en coton bio, extensible pour les poitrails généreux.', 'vetements', 3400, 40, '#2c4a6b'),
  ('impermeable-jaune', 'Imperméable ciré', 'Le ciré breton, version ras du sol. Capuche amovible.', 'vetements', 3900, 18, '#d9a520'),
  ('peluche-blaireau', 'Peluche blaireau', 'Pour rappeler à votre teckel son métier d''origine. Couineur intégré.', 'jouets', 1600, 60, '#5e5a52'),
  ('balle-terrier', 'Balle à terrier', 'Balle en caoutchouc naturel, taille adaptée aux petites mâchoires.', 'jouets', 900, 80, '#c2462e'),
  ('tapis-fouille', 'Tapis de fouille', 'Cachez les friandises, laissez le flair travailler.', 'jouets', 2900, 22, '#5d7a4a'),
  ('biscuits-saucisse', 'Biscuits en forme de saucisse', 'Biscuits au foie de volaille, cuits au four en petit lot. Sachet de 200 g.', 'friandises', 850, 120, '#c8894a'),
  ('os-moelle', 'Os à mâcher naturel', 'Os de bœuf séché, sans additif. Lot de 3.', 'friandises', 1200, 70, '#e3c79a'),
  ('harnais-h', 'Harnais en H dos long', 'Répartit la traction sans peser sur la colonne. Cuir végétal.', 'accessoires', 4400, 30, '#6b3b1f'),
  ('rampe-canape', 'Rampe de canapé', 'Ménagez le dos de votre teckel : finis les sauts du canapé.', 'accessoires', 8900, 10, '#8a7356'),
  ('gamelle-ceramique', 'Gamelle céramique surélevée', 'Hauteur étudiée pour les pattes courtes, émail sans plomb.', 'accessoires', 2700, 35, '#3f6e6a'),
  ('panier-terrier', 'Panier « terrier »', 'Panier couvert pour les teckels qui aiment s''enfouir.', 'accessoires', 6900, 12, '#7d4e57'),
  ('beret-parisien', 'Béret parisien', 'Béret en laine bouillie avec élastique sous le menton, pour ne pas le perdre en balade.', 'vetements', 2200, 30, '#1a1a1a'),
  ('casquette-teckel', 'Casquette à oreilles', 'Casquette en coton avec deux ouvertures pour laisser passer les oreilles. Protège du soleil.', 'vetements', 1900, 25, '#2c4a6b'),
  ('lunettes-soleil', 'Lunettes de soleil canines', 'Verres filtrants anti-UV et sangle réglable, pour les teckels sensibles à la lumière.', 'accessoires', 2400, 15, '#111111'),
  ('pull-torsade', 'Pull en laine torsadée', 'Pull à torsades en laine mérinos, coupé long pour couvrir tout le dos sans gêner les pattes.', 'vetements', 4200, 20, '#e9dcc3'),
  ('foulard-rouge', 'Foulard rouge', 'Bandana en coton à nouer au cou, lavable en machine.', 'accessoires', 1400, 50, '#b3122a'),
  ('noeud-papillon', 'Nœud papillon', 'Nœud papillon à clipser sur le collier, pour les grandes occasions.', 'accessoires', 1200, 40, '#111111')
on conflict (slug) do nothing;
