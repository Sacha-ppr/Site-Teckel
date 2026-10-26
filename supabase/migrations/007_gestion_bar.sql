-- =====================================================================
-- Gestion du bar : caisse (espèces / carte), présence des teckels, mouvements de stock.
-- À exécuter dans Supabase > SQL Editor, après schema.sql et 006_securite.sql. Idempotent.
-- Tout est réservé à l'administrateur (RLS + is_admin()).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Caisse : chaque recette ou dépense est une écriture. Une erreur se corrige
-- par une écriture inverse, jamais en modifiant ou supprimant une ligne.
-- ---------------------------------------------------------------------
create table if not exists public.cash_entries (
  id bigint generated always as identity primary key,
  business_day date not null,
  kind text not null check (kind in ('recette', 'depense')),
  category text not null check (category in ('bar', 'boutique', 'fournisseur', 'charges', 'autre')),
  method text not null check (method in ('especes', 'carte')),
  amount_cents integer not null check (amount_cents > 0),
  label text not null check (char_length(label) between 1 and 120),
  created_at timestamptz not null default now()
);

create index if not exists cash_entries_day_idx on public.cash_entries (business_day);

-- Clôture de caisse : fond de caisse et espèces comptées en fin de journée.
create table if not exists public.cash_closings (
  business_day date primary key,
  opening_float_cents integer not null default 0 check (opening_float_cents >= 0),
  counted_cash_cents integer not null check (counted_cash_cents >= 0),
  note text check (char_length(note) <= 300),
  closed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Présence des teckels. Les identifiants correspondent aux slugs de lib/residents.ts.
-- Une présence dure au plus 4 h par jour (plafond de la charte). Le plafond propre à chaque
-- teckel (ex. 2 h pour Blanca) est vérifié dans l'application (lib/residents.ts).
-- ---------------------------------------------------------------------
create table if not exists public.dog_presence (
  id bigint generated always as identity primary key,
  business_day date not null,
  dog text not null check (dog in ('chorizo', 'brioche', 'merguez', 'praline', 'knacki', 'saucisson', 'blanca')),
  status text not null check (status in ('presente', 'absente')),
  start_time time,
  end_time time,
  created_at timestamptz not null default now(),
  unique (business_day, dog),
  check (
    status = 'absente'
    or (
      start_time is not null
      and end_time is not null
      and end_time > start_time
      and end_time - start_time <= interval '4 hours'
    )
  ),
  check (status = 'presente' or (start_time is null and end_time is null))
);

-- ---------------------------------------------------------------------
-- Mouvements de stock : l'historique explique chaque variation de products.stock.
-- ---------------------------------------------------------------------
create table if not exists public.stock_movements (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products (id) on delete cascade,
  delta integer not null check (delta <> 0),
  reason text not null check (reason in ('livraison', 'casse', 'vente_bar', 'autre')),
  note text check (char_length(note) <= 200),
  created_at timestamptz not null default now()
);

create index if not exists stock_movements_product_idx on public.stock_movements (product_id);

-- Ajuste le stock et journalise le mouvement dans la même transaction.
create or replace function public.adjust_stock(
  p_product bigint,
  p_delta integer,
  p_reason text,
  p_note text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock integer;
begin
  if not public.is_admin() then
    raise exception 'Réservé à l''administrateur';
  end if;
  if p_delta = 0 then
    raise exception 'Mouvement nul';
  end if;

  update public.products
  set stock = stock + p_delta
  where id = p_product and stock + p_delta >= 0
  returning stock into v_stock;
  if not found then
    raise exception 'Stock insuffisant ou produit introuvable';
  end if;

  insert into public.stock_movements (product_id, delta, reason, note)
  values (p_product, p_delta, p_reason, nullif(trim(coalesce(p_note, '')), ''));
  return v_stock;
end;
$$;

-- ---------------------------------------------------------------------
-- Row Level Security : administrateur uniquement, sur les trois tables.
-- ---------------------------------------------------------------------
alter table public.cash_entries enable row level security;
alter table public.cash_closings enable row level security;
alter table public.dog_presence enable row level security;
alter table public.stock_movements enable row level security;

drop policy if exists "cash_entries: admin" on public.cash_entries;
create policy "cash_entries: admin" on public.cash_entries
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "cash_closings: admin" on public.cash_closings;
create policy "cash_closings: admin" on public.cash_closings
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "dog_presence: admin" on public.dog_presence;
create policy "dog_presence: admin" on public.dog_presence
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "stock_movements: admin" on public.stock_movements;
create policy "stock_movements: admin" on public.stock_movements
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

revoke execute on function public.adjust_stock(bigint, integer, text, text) from public, anon;
grant execute on function public.adjust_stock(bigint, integer, text, text) to authenticated;
