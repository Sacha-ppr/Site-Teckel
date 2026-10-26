-- =====================================================================
-- Durcissement sécurité (audit d'octobre 2026).
-- À exécuter dans Supabase > SQL Editor, après schema.sql. Idempotent.
-- Chaque bloc dit quelle faille il ferme.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Élévation de privilèges : le rôle admin ne vaut que pour un email confirmé.
--    Avant : n'importe qui pouvait s'inscrire avec l'adresse d'un administrateur
--    (admin_emails) et recevoir le rôle admin, sans posséder la boîte mail, dès
--    que « Confirm email » est désactivé dans Supabase.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.id = auth.uid()
      and p.role = 'admin'
      and u.email_confirmed_at is not null
  );
$$;

-- Nom complet borné à l'inscription (le champ vient du navigateur).
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
    left(new.raw_user_meta_data ->> 'full_name', 100),
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

-- ---------------------------------------------------------------------
-- 2. Réservations : l'API Supabase accepte les écritures directes, sans passer par
--    l'application. Les règles métier doivent donc vivre en base.
--    Avant : un compte pouvait réserver le lundi/mardi (fermé), des années à l'avance,
--    et bloquer tous les créneaux avec des réservations en série.
-- ---------------------------------------------------------------------
alter table public.reservations drop constraint if exists reservations_contact_name_len;
alter table public.reservations add constraint reservations_contact_name_len
  check (char_length(contact_name) between 1 and 80) not valid;
alter table public.reservations drop constraint if exists reservations_phone_len;
alter table public.reservations add constraint reservations_phone_len
  check (phone is null or char_length(phone) <= 30) not valid;
alter table public.reservations drop constraint if exists reservations_notes_len;
alter table public.reservations add constraint reservations_notes_len
  check (notes is null or char_length(notes) <= 500) not valid;

create or replace function public.check_reservation_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booked integer;
  v_open integer;
begin
  if new.status = 'annulee' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.date < current_date then
      raise exception 'Impossible de réserver dans le passé';
    end if;
    if new.date > current_date + 90 then
      raise exception 'Réservation trop loin dans le temps (90 jours maximum)';
    end if;
    -- Fermé le lundi (1) et le mardi (2).
    if extract(isodow from new.date) in (1, 2) then
      raise exception 'Le bar est fermé le lundi et le mardi';
    end if;
    -- Plafond de réservations à venir par compte : empêche de monopoliser les créneaux.
    select count(*) into v_open
    from public.reservations
    where user_id = new.user_id and status = 'confirmee' and date >= current_date;
    if v_open >= 6 then
      raise exception 'Trop de réservations en cours : annulez-en une avant d''en faire une autre';
    end if;
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

-- ---------------------------------------------------------------------
-- 3. Commandes : le paiement est simulé, donc rien ne limitait le vidage du stock.
--    Avant : un compte pouvait passer des commandes en boucle ou avec des quantités
--    démesurées et vider toute la boutique ; nom et adresse sans limite de taille.
--    Les prix restent relus en base (jamais pris du client).
-- ---------------------------------------------------------------------
alter table public.orders drop constraint if exists orders_shipping_name_len;
alter table public.orders add constraint orders_shipping_name_len
  check (char_length(shipping_name) between 1 and 100) not valid;
alter table public.orders drop constraint if exists orders_shipping_address_len;
alter table public.orders add constraint orders_shipping_address_len
  check (char_length(shipping_address) between 1 and 300) not valid;

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
  v_variant text;
begin
  if auth.uid() is null then
    raise exception 'Connexion requise';
  end if;
  if jsonb_typeof(items) is distinct from 'array' or jsonb_array_length(items) = 0 then
    raise exception 'Panier vide';
  end if;
  if jsonb_array_length(items) > 20 then
    raise exception 'Panier trop volumineux (20 articles différents maximum)';
  end if;
  if char_length(coalesce(shipping_name, '')) not between 1 and 100
     or char_length(coalesce(shipping_address, '')) not between 1 and 300 then
    raise exception 'Nom ou adresse de livraison invalide';
  end if;
  -- Au plus 5 commandes par heure et par compte.
  if (select count(*) from public.orders
      where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Trop de commandes en peu de temps, réessayez plus tard';
  end if;

  insert into public.orders (user_id, total_cents, shipping_name, shipping_address)
  values (auth.uid(), 0, shipping_name, shipping_address)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(items) loop
    -- Quantité obligatoire et bornée (la fiche produit plafonne déjà à 9).
    v_qty := (v_item ->> 'quantity')::integer;
    if v_qty is null or v_qty < 1 or v_qty > 9 then
      raise exception 'Quantité invalide (1 à 9 par article)';
    end if;
    -- Taille choisie sur la fiche produit (XS, S, M, L…), gardée dans le libellé de la ligne.
    v_variant := nullif(trim(coalesce(v_item ->> 'variant', '')), '');
    if v_variant is not null and v_variant !~ '^[A-Z]{1,3}$' then
      raise exception 'Taille invalide';
    end if;
    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::bigint and active
      for update;
    if not found then
      raise exception 'Produit introuvable';
    end if;
    if v_product.stock < v_qty then
      raise exception 'Stock insuffisant pour %', v_product.name;
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_cents)
    values (v_order_id, v_product.id, v_product.name || coalesce(' · taille ' || v_variant, ''), v_qty, v_product.price_cents);
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

-- Droits d'exécution inchangés : on les réaffirme au cas où la fonction aurait été recréée.
revoke execute on function public.place_order(jsonb, text, text) from public, anon;
grant execute on function public.place_order(jsonb, text, text) to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.check_reservation_capacity() from public, anon, authenticated;
