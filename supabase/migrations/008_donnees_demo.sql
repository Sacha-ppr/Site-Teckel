-- =====================================================================
-- Données de démonstration : commandes boutique + réservations du bar,
-- pour peupler les graphiques et tableaux du back-office (/admin).
-- À exécuter manuellement dans Supabase > SQL Editor, après schema.sql,
-- une fois qu'au moins un compte existe (le tien suffit).
-- Pas idempotent : relancer ce script ajoute d'autres commandes et
-- réservations en plus des précédentes (sans casser quoi que ce soit).
-- =====================================================================

do $$
declare
  v_user_ids uuid[];
  v_product_ids bigint[];
  v_user uuid;
  v_product public.products;
  v_order_id bigint;
  v_total integer;
  v_items_count integer;
  v_qty integer;
  v_created timestamptz;
  v_status text;
  v_first_names text[] := array[
    'Camille','Lucas','Manon','Hugo','Chloé','Nathan','Léa','Louis','Emma','Gabriel',
    'Sarah','Jules','Inès','Adam','Zoé','Mathis','Juliette','Enzo','Lina','Noah',
    'Alice','Victor','Agathe','Tom','Margaux'
  ];
  v_last_names text[] := array[
    'Dubois','Lefèvre','Moreau','Girard','Bernard','Rousseau','Fontaine','Chevalier',
    'Lemoine','Gauthier','Perrot','Mercier','Blanchard','Guérin','Boyer','Faure','Legrand'
  ];
  v_streets text[] := array[
    'rue de Charonne','rue du Faubourg-Saint-Antoine','rue de la Roquette','avenue de la République',
    'rue Oberkampf','boulevard Voltaire','rue Saint-Maur','rue de Montreuil','rue de Bagnolet',
    'rue de la Folie-Regnault','rue des Pyrénées','rue de Belleville','rue Myrha','rue Caulaincourt',
    'rue Lecourbe','rue de Vaugirard','rue du Cherche-Midi','quai de Valmy'
  ];
  v_postal text[] := array['75011','75012','75020','75003','75010','75019','75015','75006','75018'];
  v_notes text[] := array[
    'Anniversaire du teckel','Première visite','Allergie aux fruits à coque pour le goûter',
    'Vient avec son propre teckel','Poussette à prévoir','Table côté fenêtre si possible'
  ];
  v_date date;
  v_slot text;
  v_remaining integer;
  v_n integer;
  v_guests integer;
  v_dow integer;
  i integer;
  j integer;
  d integer;
  k integer;
begin
  select array_agg(id) into v_user_ids from auth.users;
  select array_agg(id) into v_product_ids from public.products where active;

  if v_user_ids is null or array_length(v_user_ids, 1) = 0 then
    raise notice 'Aucun compte existant : crée au moins un compte sur le site puis relance ce script.';
    return;
  end if;
  if v_product_ids is null or array_length(v_product_ids, 1) = 0 then
    raise notice 'Aucun produit actif : vérifie que schema.sql a bien inséré le catalogue.';
    return;
  end if;

  -- ---- Commandes boutique des ~28 derniers jours ----
  for i in 1..55 loop
    v_user := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))::int];
    v_created := now() - (random() * interval '27 days') - (random() * interval '18 hours');
    v_status := case
      when v_created < now() - interval '5 days'
        then (array['expediee', 'expediee', 'expediee', 'expediee', 'annulee'])[1 + floor(random() * 5)::int]
      else (array['payee', 'preparation', 'preparation', 'expediee'])[1 + floor(random() * 4)::int]
    end;

    insert into public.orders (user_id, status, total_cents, shipping_cents, shipping_name, shipping_address, created_at)
    values (
      v_user,
      v_status,
      0,
      0,
      v_first_names[1 + floor(random() * array_length(v_first_names, 1))::int] || ' ' ||
        v_last_names[1 + floor(random() * array_length(v_last_names, 1))::int],
      (1 + floor(random() * 140))::int || ' ' ||
        v_streets[1 + floor(random() * array_length(v_streets, 1))::int] || ', ' ||
        v_postal[1 + floor(random() * array_length(v_postal, 1))::int] || ' Paris',
      v_created
    )
    returning id into v_order_id;

    v_total := 0;
    v_items_count := 1 + floor(random() * 3)::int;
    for j in 1..v_items_count loop
      select * into v_product from public.products
        where id = v_product_ids[1 + floor(random() * array_length(v_product_ids, 1))::int];
      v_qty := 1 + floor(random() * 2)::int;

      insert into public.order_items (order_id, product_id, product_name, quantity, unit_price_cents)
      values (v_order_id, v_product.id, v_product.name, v_qty, v_product.price_cents);
      v_total := v_total + v_qty * v_product.price_cents;

      -- Même logique que place_order() : le stock bouge dès la commande, pas à l'expédition.
      update public.products set stock = stock - least(v_qty, stock) where id = v_product.id;
    end loop;

    update public.orders
    set shipping_cents = case when v_total >= 6000 then 0 else 590 end,
        total_cents = v_total + case when v_total >= 6000 then 0 else 590 end
    where id = v_order_id;
  end loop;

  -- ---- Réservations du bar sur les deux prochaines semaines (fermé lundi et mardi) ----
  for d in 0..13 loop
    v_date := current_date + d;
    v_dow := extract(isodow from v_date);
    if v_dow in (1, 2) then continue; end if;

    foreach v_slot in array array['10:00', '12:00', '14:00', '16:00', '18:00'] loop
      v_remaining := 16;
      v_n := case when v_dow in (6, 7) then 2 + floor(random() * 4)::int else floor(random() * 4)::int end;

      for k in 1..v_n loop
        if v_remaining <= 0 then exit; end if;
        v_guests := least(1 + floor(random() * 4)::int, v_remaining);
        v_remaining := v_remaining - v_guests;
        v_user := v_user_ids[1 + floor(random() * array_length(v_user_ids, 1))::int];

        -- Un créneau déjà occupé par de vraies réservations fait échouer l'insertion
        -- (vérification de capacité) : on l'ignore simplement plutôt que de tout annuler.
        begin
          insert into public.reservations (user_id, contact_name, phone, date, slot, guests, formula, with_own_dog, notes, status)
          values (
            v_user,
            v_first_names[1 + floor(random() * array_length(v_first_names, 1))::int] || ' ' ||
              v_last_names[1 + floor(random() * array_length(v_last_names, 1))::int],
            '0' || (6 + floor(random() * 2))::int || lpad(floor(random() * 100000000)::text, 8, '0'),
            v_date,
            v_slot,
            v_guests,
            (array['cafe-calin', 'gouter-teckel', 'apero-saucisse'])[1 + floor(random() * 3)::int],
            random() < 0.35,
            case when random() < 0.25 then v_notes[1 + floor(random() * array_length(v_notes, 1))::int] else null end,
            case when random() < 0.06 then 'annulee' else 'confirmee' end
          );
        exception when others then
          null;
        end;
      end loop;
    end loop;
  end loop;
end $$;
