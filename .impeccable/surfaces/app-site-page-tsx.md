---
version: 1
slug: "app-site-page-tsx"
primary_target: "app/(site)/page.tsx"
related_targets: ["app/(site)/layout.tsx"]
---

# Site public — Le Bar à Teckels

Scope: tout le site public `app/(site)` (accueil, bar, réserver, boutique, fiche produit, résidents, ateliers, panier, compte, connexion, inscription, crédits). Mode: Persuade (accueil, bar, boutique) ; les écrans réserver, panier, compte et auth héritent du monde en restant des outils. `/admin` hors périmètre (Operate, reste sobre).

Audience/job: jeunes urbains, propriétaires de teckels, familles → trouver un créneau libre et réserver vite ; acheter du matériel pensé pour le dos long.
Constraints: vraies photos de teckels (Wikimedia Commons, créditées sur /credits), aucune illustration ; aucun avis ni chiffre inventé.

## Direction contract

THESIS: Le bar est une cabine Photomaton : chaque teckel, créneau et produit est cadré comme une pose de bande photo. Refuse le café-chaleureux crème/serif/caramel et le hero « titre + bouton + cartes ».

OWN-WORLD: Rouge rideau #b3122a en aplats de sections entières ; blanc tirage #f7f5f0 pour les bandes et le papier ; noir #111 ; panneau chromé #b9bcc0 à coins arrondis façon monnayeur ; jaune jeton #ffd400 pour les chiffres et l'action principale. Photos noir et blanc contrastées dans des cadres blancs à marge épaisse, bandes verticales légèrement inclinées. Archivo (large/étroit, très gras) en capitales pour les titres, Archivo normal pour le texte.

STORY: Le visiteur comprend en une vue qu'il s'agit d'un café avec sept teckels résidents, voit les places restantes par créneau en gros compteurs, choisit un créneau et réserve ; puis découvre les résidents, les formules, la boutique.

FIRST VIEWPORT: Fond rouge plein. À gauche, une bande verticale de 4 vraies photos N&B de teckels, inclinée de -2°, débordant en bas. À droite, titre géant en capitales « 4 poses, 6 teckels, 1 café. », puis le panneau chromé noir : jour ouvert sélectionné, 5 compteurs jaunes (places restantes en direct), bouton jaune « Réserver ‹jour› › ». Le clic sur un compteur pré-remplit /reserver.

FORM: Photomaton (cabine photo parisienne), direction assignée par le tirage, 1re de la main. Raises: compteurs chiffrés géants (Nixie) ; réservation lue comme une seule bande de 4 poses (Provenance) ; rouge cabine en aplats de sections entières (OSPAAAL). SEED REFERENCE seed:519ed2ff64ef1322. Signature: le flash — à l'arrivée, les 4 poses de la bande s'exposent une à une avec un éclair blanc ; motion = éclair bref + ease-out exponentiel.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
