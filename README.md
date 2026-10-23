# Le Bar à Teckels

Site e-commerce d'un bar à teckels parisien : réservation de créneaux au bar, boutique en ligne pour
teckels, présentation des chiens résidents, ateliers, et un espace pro pour l'équipe.

Stack : Next.js 16 (App Router, Cache Components), Tailwind CSS 4, Supabase (Auth + Postgres).

## Fonctionnalités

**Site client**
- `/` accueil · `/bar` concept, formules, charte et FAQ
- `/reserver` réservation d'un créneau (16 places par créneau, 5 créneaux par jour, fermé lundi et mardi),
  places restantes en temps réel
- `/boutique` catalogue filtrable, fiches produit, panier et commande (paiement simulé)
- `/residents` les six teckels du bar · `/ateliers` ateliers et événements
- `/compte` réservations (annulables) et commandes du client

**Espace pro** (`/admin`, rôle `admin` uniquement)
- Tableau de bord : couverts du jour, remplissage sur 7 jours, CA bar prévu, CA boutique 30 jours,
  planning par créneau, commandes à traiter, alertes de stock
- Réservations : filtres (date, statut, nom), changement de statut (arrivée, absente, annulée), export CSV
- Commandes : suivi et changement de statut
- Produits : prix, stock et mise en ligne

## Installation

1. Variables d'environnement dans `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```
2. Dans Supabase > **SQL Editor**, exécuter tout le fichier [`supabase/schema.sql`](supabase/schema.sql)
   (tables, sécurité RLS, fonctions et catalogue de départ).
3. `pnpm install` puis `pnpm dev`.

## Compte administrateur

Le script SQL déclare `admin@bar-a-teckels.fr` comme email administrateur : tout compte créé avec cet
email reçoit le rôle `admin` automatiquement.

1. Aller sur `/inscription` et créer le compte avec `admin@bar-a-teckels.fr`.
2. Si la confirmation par email est activée dans Supabase (Authentication > Providers > Email),
   confirmer l'utilisateur depuis Authentication > Users, ou désactiver la confirmation en développement.
3. Se connecter sur `/connexion` : redirection vers `/admin`.

Pour utiliser une autre adresse, ou promouvoir un compte existant :

```sql
insert into public.admin_emails (email) values ('vous@exemple.fr');            -- futurs comptes
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'vous@exemple.fr');         -- compte existant
```

## Sécurité

- Les droits sont appliqués en base par Row Level Security : un client ne voit que ses réservations et
  commandes, seul un admin peut modifier statuts, prix et stock.
- Les prix d'une commande sont relus en base (`place_order`), jamais pris du navigateur.
- La capacité des créneaux est vérifiée par un trigger avec verrou, ce qui empêche le surbooking.
- Chaque action serveur de l'espace pro revérifie le rôle admin.

