-- =====================================================================
-- Remplace l'email administrateur par défaut par les comptes de l'équipe.
-- À exécuter dans SQL Editor sur une base où schema.sql a déjà tourné.
-- Idempotent.
-- =====================================================================

delete from public.admin_emails where lower(email) = 'admin@bar-a-teckels.fr';

insert into public.admin_emails (email)
values ('josephhalle992@gmail.com'), ('josephhalle@hotmail.com')
on conflict do nothing;

-- Le compte existe peut-être déjà : on lui donne le rôle admin tout de suite.
update public.profiles set role = 'admin'
where id in (select id from auth.users where lower(email) in ('josephhalle992@gmail.com', 'josephhalle@hotmail.com'));

-- L'ancien compte admin ne garde pas ses droits.
update public.profiles set role = 'client'
where id in (select id from auth.users where lower(email) = 'admin@bar-a-teckels.fr');
