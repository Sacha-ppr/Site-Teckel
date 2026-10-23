# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Visiteurs du bar (primaire)** : des gens (souvent en groupe, couples, familles) qui veulent passer un moment avec les teckels d'un café-bar, réserver un créneau, acheter des produits, et soutenir une asso de protection des chiens.
- **Propriétaire du bar (secondaire)** : suit le CA en temps réel et pilote les réservations et les commandes depuis un back-office.

## Product Purpose

Site vitrine + réservation + boutique + dons pour un « Bar à Teckel » (café-bar physique dont la particularité est ses teckels présents sur place), avec une page propriétaire « Traqué le CA » qui agrège toute la data. Succès : un visiteur comprend le concept, réserve un créneau avec un teckel, achète, donne — et le propriétaire voit d'un coup d'œil son CA ventilé et gère commandes/réservations.

## Positioning

Un lieu physique dont l'attrait est un groupe de teckels vivants : on réserve non pas une table mais **un créneau avec un chien précis**, avec sa disponibilité propre (jours, horaires, quota journalier, repos). Aucun voisin du secteur n'a de catalogue de chiens réservables à la carte.

## Operating Context

- Café-bar physique : horaires d'ouverture, adresse, carte de boissons/snacks.
- Créneaux de rencontre encadrés avec un teckel, durée définie, tarif par créneau.
- Commerce de détail : expédition ou retrait boutique, stocks simples.
- Dons : page dédiée + case à cocher dans les tunnels d'achat/réservation.
- Le propriétaire consulte son dashboard quotidiennement, souvent sur mobile derrière le comptoir.

## Capabilities and Constraints

**Réservation (créneau avec un teckel)**
- Étapes : choisir le chien → le jour → l'horaire → le nombre de personnes.
- Durée + prix par créneau (ex. 30/60 min, tarif par personne ou groupe).
- Créneaux limités **par chien** : dispo propres à chaque teckel (jours, horaires, max de séances/jour, repos).
- Extras : boisson offerte, gâteau pour chien, photo souvenir, privatisation.
- Compte client : confirmation (email simulé), annulation / reprogrammation.

**Boutique** — 4 familles de produits :
1. Merch du bar (t-shirts, mugs, tote bags, affiches)
2. Produits pour chiens (colliers, laisses, jouets, friandises, gamelles)
3. Snacks & boissons à emporter (bières/sirops maison, gâteaux pour chiens, coffee beans)
4. Coffrets & cartes cadeaux (dont bon pour un créneau avec un teckel)

**Dons**
- Page don dédiée **+** case « ajouter un don » dans les tunnels de réservation et d'achat.
- 3 associations partenaires réelles : **30 Millions d'Amis**, **SPA**, et une **3e asso locale** (nom à confirmer). Le doneur choisit laquelle soutenir ; montants libres ou prédéfinis.

**Back-office propriétaire « Traqué le CA »**
- CA total (jour / semaine / mois) + ventilation par source : réservations, boutique, dons.
- Graphique d'évolution du CA dans le temps.
- Stats d'occupation des chiens : teckels les plus réservés, taux d'occupation, créneaux vides.
- **Tous les outils de gestion des commandes et des réservations** : listes, statuts (en attente / confirmée / annulée / honorée), actions.

**Technique**
- Paiement simulé : tunnels complets (panier, récap, formulaire, confirmation) mais aucune carte réelle, aucune clé API. Données de démo persistées localement.
- Langue : **français**.

## Brand Commitments

- Nom retenu : **« Bar à Teckel »** (l'utilisateur a délégué l'identité).
- **Humour canin requis** : de petits détails drôles à travers tout le site, en référence aux chiens et particulièrement aux teckels — écrans de chargement, micro-animations, transitions, états vides, micro-copy. C'est un engagement de marque, pas une option décorative.
- **Visuels générés par IA** : l'utilisateur a demandé d'utiliser la meilleure IA d'image disponible (Gemini « Nano Banana » Pro) pour produire les visuels du site ; l'identité visuelle doit prévoir des images générées (portraits de teckels, ambiances, produits).
- L'asso **30 Millions d'Amis** et la **SPA** sont des noms réels à respecter (pas de reprise graphique de leurs logos sans asset fourni).
- Identité du lieu entièrement inventée (ville/adresse fictives, 4–6 teckels avec prénoms et personnalités, carte, horaires) et conçue pour être remplacée facilement par les vrais éléments.

## Evidence on Hand

Aucun asset réel : ni photo des teckels, ni logo, ni avis clients, ni vraie adresse. Aucun témoignage, chiffre ou avis ne doit être présenté comme réel — le contenu de démo est marqué comme tel. Next.js 16 + Tailwind 4 déjà en place (coquille create-next-app).

## Product Principles

1. **Le chien d'abord** : chaque teckel est une entité à part entière (photo, personnalité, dispo, stats) — c'est le produit, pas la décoration.
2. **Le chemin de réservation est sacré** : en 4 étapes maximum, du choix du chien à la confirmation.
3. **Une seule source de vérité pour le CA** : réservations, boutique et dons alimentent le même journal de transactions que le dashboard lit.
4. **Zéro friction, zéro faux vrai** : paiement simulé mais tunnels crédibles ; contenu inventé jamais présenté comme réel.
5. **Mobile derrière le comptoir** : le dashboard est d'abord pensé pour un écran de téléphone.
