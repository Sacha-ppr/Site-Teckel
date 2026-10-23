-- =====================================================================
-- Tailles des articles : la taille choisie est enregistrée dans la ligne de commande.
-- À exécuter dans SQL Editor. Idempotent (remplace la fonction).
-- =====================================================================

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
  if jsonb_array_length(items) = 0 then
    raise exception 'Panier vide';
  end if;

  insert into public.orders (user_id, total_cents, shipping_name, shipping_address)
  values (auth.uid(), 0, shipping_name, shipping_address)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(items) loop
    v_qty := (v_item ->> 'quantity')::integer;
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
    if v_qty < 1 or v_product.stock < v_qty then
      raise exception 'Stock insuffisant pour %', v_product.name;
    end if;

    update public.products set stock = stock - v_qty where id = v_product.id;
    insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_cents)
    values (
      v_order_id,
      v_product.id,
      v_product.name || coalesce(' · taille ' || v_variant, ''),
      v_qty,
      v_product.price_cents
    );
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

revoke execute on function public.place_order(jsonb, text, text) from public, anon;
grant execute on function public.place_order(jsonb, text, text) to authenticated;
