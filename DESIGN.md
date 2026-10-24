---
name: Le Bar à Teckels
description: Café à teckels parisien et boutique pour dos longs, mis en scène comme une cabine Photomaton.
colors:
  rouge: "#b3122a"
  rouge-fonce: "#8c0c1f"
  rose: "#f6d3d8"
  jeton: "#ffd400"
  jeton-clair: "#ffe14d"
  tirage: "#f7f5f0"
  tirage-2: "#ebe7de"
  papier: "#fffefa"
  encre: "#111111"
  encre-douce: "#57534c"
  chrome: "#b9bcc0"
  chrome-clair: "#dfe1e3"
  panneau: "#1a1a1a"
  case: "#2a2a2a"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.6vw, 5.5rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 80"
  compteur:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.9
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 75"
rounded:
  pilule: "999px"
  panneau: "20px"
  case: "12px"
  field: "10px"
  case-sm: "8px"
spacing:
  tirage: "10px"
  gutter: "16px"
  gutter-md: "32px"
  section: "80px"
  section-md: "112px"
  container: "1400px"
components:
  button-jeton:
    backgroundColor: "{colors.jeton}"
    textColor: "{colors.encre}"
    rounded: "{rounded.pilule}"
    padding: "0.85rem 1.6rem"
  button-jeton-hover:
    backgroundColor: "{colors.jeton-clair}"
  button-encre:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.tirage}"
    rounded: "{rounded.pilule}"
    padding: "0.85rem 1.6rem"
  button-encre-hover:
    backgroundColor: "{colors.rouge}"
  button-ligne:
    rounded: "{rounded.pilule}"
    padding: "0.85rem 1.6rem"
  panneau:
    backgroundColor: "{colors.panneau}"
    textColor: "{colors.tirage}"
    rounded: "{rounded.panneau}"
    padding: "24px"
  tirage:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.encre}"
    padding: "10px 10px 14px"
  compteur-case:
    backgroundColor: "{colors.case}"
    textColor: "{colors.chrome-clair}"
    rounded: "{rounded.case}"
  compteur-case-selected:
    backgroundColor: "{colors.jeton}"
    textColor: "{colors.encre}"
    rounded: "{rounded.case}"
  field:
    backgroundColor: "#ffffff"
    textColor: "{colors.encre}"
    rounded: "{rounded.field}"
    padding: "0.65rem 0.85rem"
  enseigne-header:
    backgroundColor: "{colors.rouge}"
    textColor: "{colors.tirage}"
    padding: "12px 32px"
---

# Design System: Le Bar à Teckels

## Overview

**Creative North Star: "La cabine Photomaton"**

Le site public (`app/(site)`) est une cabine photo parisienne : rideau rouge en aplats de sections entières, bandes de tirages noir et blanc à marge épaisse, monnayeur chromé noir où s'affichent en gros chiffres jaunes les places restantes. Chaque teckel, créneau et produit est cadré comme une pose. Le monde est franc, graphique et dense en contrastes, jamais chaleureux au sens « café crème » : pas de serif, pas de caramel, pas de beige feutré.

Une seule famille, Archivo variable auto-hébergée, porte toute la voix en jouant sur ses axes de graisse et de largeur : capitales larges très grasses pour l'enseigne, étroites espacées pour les légendes, très étroites pour les chiffres. Les surfaces sont plates ; seuls les objets physiques de la cabine (jeton, panneau, tirage) ont une ombre. La signature est le flash : à l'arrivée, les poses d'une bande s'exposent une à une sous un éclair blanc.

L'espace d'administration `/admin` est exclu de ce système : c'est un outil Operate sobre en ardoise, documenté à part s'il le faut.

**Key Characteristics:**
- Sections pleine largeur alternant rouge rideau, noir encre et blanc tirage, séparées par des filets de 6px rouge foncé.
- Photos réelles de teckels, toujours en noir et blanc contrasté, dans des tirages blancs à marge épaisse, légèrement inclinés.
- Jaune jeton réservé aux chiffres, à l'action principale, au focus et à la sélection.
- Archivo seule, la largeur de l'axe `wdth` distingue les rôles.
- Le flash comme unique mouvement de mise en scène, coupé sous `prefers-reduced-motion`.

## Colors

Une palette de cabine : un rouge saturé en grands aplats, un jaune de signal, et des neutres papier, encre et chrome.

### Primary
- **Rouge rideau** (`rouge`) : fond plein du héros, de l'en-tête et du pied de page, et de sections entières. Sur fond clair, il n'apparaît qu'en survol de lien ou en petite légende (étiquette d'atelier).
- **Rouge rideau foncé** (`rouge-fonce`) : filets de séparation de 6px entre sections rouges, bordures internes de l'en-tête et du pied de page, texte des alertes sur fond rose.

### Secondary
- **Jaune jeton** (`jeton`) : chiffres des compteurs, bouton d'action principale, case de créneau sélectionnée, pastille du panier, contour de focus et sélection de texte.
- **Jaune jeton vif** (`jeton-clair`) : survol du bouton jeton uniquement.

### Tertiary
- **Rose rideau** (`rose`) : texte courant sur fond rouge (contraste ~5:1), fond des messages d'alerte.

### Neutral
- **Blanc tirage** (`tirage`) : fond de page et texte clair sur fonds sombres.
- **Tirage ombré** (`tirage-2`) : piste de barre de défilement, squelettes de chargement.
- **Papier photo** (`papier`) : le blanc légèrement plus chaud des cadres de tirage.
- **Encre** (`encre`) : texte, filets de 2px entre lignes de liste, bordure des champs, fond des sections sombres et du bouton encre.
- **Encre douce** (`encre-douce`) : texte secondaire et légendes sur fond clair.
- **Chrome** (`chrome`) et **chrome clair** (`chrome-clair`) : cadre de 6px du panneau, boutons ronds de navigation du monnayeur, texte secondaire sur fond noir.
- **Panneau** (`panneau`) et **case** (`case`) : fond du monnayeur et de ses cases de compteur.

### Named Rules
**The Rideau Rule.** Le rouge arrive en aplat de section entière, bord à bord. Sur papier, il se limite au survol et aux petites légendes ; jamais en grand bloc décoratif à l'intérieur d'une section claire.

**The Jeton Rule.** Le jaune signale ce qu'on compte ou ce qu'on actionne : chiffres, action principale, sélection, focus. Jamais en fond décoratif ni en texte courant.

## Typography

**Display Font:** Archivo variable (avec system-ui, sans-serif)
**Body Font:** Archivo variable (même fichier, largeur 100%)
**Label/Mono Font:** Archivo, largeur 80% (légendes) et 75% (compteurs)

**Character:** une enseigne lumineuse en capitales larges et noires, appuyée par des légendes de bande étroites et des chiffres de monnayeur serrés ; tout sort d'une seule police variable (graisse 100–900, largeur 62–125%).

### Hierarchy
- **Display** (900, largeur 112%, capitales, `clamp(3rem, 6.6vw, 5.5rem)` à `clamp(3rem, 8vw, 6rem)`, interligne 0.92, `text-wrap: balance`) : H1 de page.
- **Headline** (900, largeur 112%, capitales, `clamp(2.4rem, 5vw, 4.5rem)`) : titres de section.
- **Title** (900, largeur 112%, capitales, 1.35–2rem) : noms de résidents, formules, titres de panneau.
- **Body** (400, 1rem–1.2rem, interligne relâché 1.625, 36–44rem max) : paragraphes ; texte d'introduction à 1.15–1.2rem.
- **Label** (700, largeur 80%, capitales, 0.78rem, espacement 0.14em) : navigation, légendes sous tirage, termes de liste de définitions, état de stock.
- **Compteur** (800, largeur 75%, chiffres tabulaires, interligne 0.9, jaune par défaut) : places restantes, prix des formules, numéro de commande. Les prix produits reprennent la même logique en encre (800, largeur 80%, chiffres tabulaires).

### Named Rules
**The Largeur Rule.** L'axe de largeur porte le rôle : 112% pour l'enseigne, 100% pour le texte, 80% pour légendes et prix, 75% pour les compteurs. Pas de seconde famille de police.

**The Enseigne Rule.** Tout titre est en capitales Archivo 900 larges ; le texte courant n'est jamais en capitales.

## Layout

Conteneur centré de 1400px max, gouttières de 16px puis 32px dès `md`. Les sections occupent toute la largeur avec leur propre fond et un rythme vertical de 80px, 112px dès `md`. Les grilles sont asymétriques : héros en `minmax(250px, 320px) / 1fr` sur grand écran, listes résidents et ateliers en colonne photo fixe + texte, formules en `1fr / 1.6fr`. Le héros remplit la hauteur de fenêtre sous l'en-tête dès `lg` ; la bande de poses y passe de 4 colonnes horizontales (mobile) à une colonne verticale qui déborde vers le bas. Les grilles de tirages se décalent (une colonne sur deux descend de 32px) pour casser l'alignement de catalogue. Les listes se séparent par des filets d'encre de 2px plutôt que par des cartes.

## Elevation & Depth

Système plat par défaut : profondeur portée par l'alternance des fonds de section et par des filets. Seuls les objets matériels de la cabine ont une ombre, toujours douce et tombante, jamais décalée en dur.

### Shadow Vocabulary
- **Jeton** (`box-shadow: inset 0 -3px 0 rgb(0 0 0 / 0.18), 0 6px 14px -6px rgb(0 0 0 / 0.45)`) : relief de pièce du bouton principal ; s'enfonce de 2px à l'appui.
- **Panneau** (`box-shadow: inset 0 0 0 2px #5d6064, 0 28px 50px -24px rgb(0 0 0 / 0.6)`) : liseré intérieur du cadre chromé et ombre portée du monnayeur.
- **Tirage** (`box-shadow: 0 18px 34px -18px rgb(0 0 0 / 0.55)`) : papier photo posé sur la surface.
- **Enseigne** (`box-shadow: 0 1px 0 rgb(0 0 0 / 0.25)`) : simple filet sous l'en-tête collant.

### Named Rules
**The Objet Physique Rule.** Une ombre signifie un objet qu'on pourrait tenir : pièce, monnayeur, tirage. Les sections, listes et textes restent plats.

## Shapes

Deux familles de formes. Le papier est à angles vifs : tirages, sections et filets n'ont aucun arrondi. Le matériel de la cabine est arrondi : boutons et pastilles en pilule (999px), panneau à coins de monnayeur (20px), cases de compteur (12px), champs (10px), petites cases et alertes (8px). Les boutons ronds du monnayeur (40px, cadre chrome 2px) et la pastille « + » de la FAQ (36px, jaune) sont des disques. Les tirages isolés s'inclinent entre -2° et 2° (pas de 0.5°), en alternant le sens d'un élément au suivant ; les grilles de boutique restent droites.

## Components

### Buttons
Des jetons : capitales grasses, pilule, petit enfoncement physique.
- **Shape:** pilule (999px), contenu centré, espacement 0.6rem entre libellé et icône SVG.
- **Primary (jeton):** fond jaune jeton, texte encre, 800 largeur 105%, 0.95rem, capitales, espacement 0.04em, padding 0.85rem 1.6rem ; relief Jeton.
- **Hover / Focus:** jaune vif au survol, transition 150ms ; `translateY(2px)` à l'appui ; focus par contour jaune 3px décalé de 3px ; désactivé à 45% d'opacité.
- **Encre:** fond encre, texte tirage, survol rouge ; action secondaire sur fond clair (ajouter au panier). Confirmation « Dans le panier » bascule en jaune 1.5s.
- **Ligne:** contour 2px `currentColor`, fond teinté à 12% au survol ; lien de section (« Tout le catalogue ») et actions discrètes.

### Chips
- **Style:** pastilles pilule en légende : compteur de panier jaune (28px min), « Espace pro » encre, prix d'atelier encre sur texte jaune.

### Cards / Containers
- **Tirage:** fond papier, marge 10px avec bas élargi à 14px, angles vifs, ombre Tirage ; contient une pose puis nom en Title et légende. La carte produit est un tirage droit, photo carrée qui grossit de 1.5% au survol.
- **Panneau:** fond panneau, texte tirage, cadre chrome 6px, rayon 20px, ombre Panneau, padding 16–40px. Accueille le monnayeur, la réservation, la connexion, l'inscription et le paiement.

### Inputs / Fields
- **Style:** fond blanc, bordure encre 2px, rayon 10px, padding 0.65rem 0.85rem, 1rem ; libellé au-dessus en 700 0.875rem ; placeholder gris chaud.
- **Focus:** contour jaune jeton 3px collé au champ, bordure inchangée.
- **Error:** message en bloc rose, texte rouge foncé gras, rayon 8px ; succès en bloc jaune, texte encre.

### Navigation
- **Style:** en-tête collant rouge rideau ; logotype en enseigne (1.1–1.35rem) ; liens en légende tirage, survol jaune ; bouton jeton « Réserver » à droite.
- **Mobile:** sous `lg`, rangée défilante horizontale de légendes sous un filet rouge foncé, « Réserver » en tête en jaune.

### Monnayeur (signature)
Le panneau des créneaux : sélecteur de jour entre deux disques chromés, puis cinq cases en grille. Chaque case : heure en légende, places restantes en compteur jaune à deux chiffres (`––` au chargement), « Places » ou « Complet » dessous. Case sélectionnée en jaune avec chiffres encre ; case complète grisée et désactivée. Un bouton jeton pleine largeur reprend le jour et l'heure choisis.

### Pose et flash (signature)
Toute photo est une Pose : fond encre, photo recadrée en `object-cover`, filtre `grayscale(1) contrast(1.12) brightness(1.02)`. Dans une bande, chaque pose s'expose à son tour : éclair blanc (900ms, `cubic-bezier(0.16, 1, 0.3, 1)`, pic à 95% d'opacité à 8%) et développement de la photo (1400ms, de surexposée à normale), décalés de 650ms après 350ms. Rien ne bouge sous `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** montrer de vraies photographies de teckels, passées par la Pose noir et blanc et cadrées dans un tirage.
- **Do** poser le rouge rideau en sections pleine largeur, séparées par un filet de 6px rouge foncé.
- **Do** afficher les chiffres qui comptent (places, prix de formule, numéro de commande) en compteur jaune étroit à chiffres tabulaires.
- **Do** n'utiliser qu'Archivo et faire varier la largeur selon la Largeur Rule.
- **Do** réserver les ombres aux objets de la cabine (jeton, panneau, tirage).
- **Do** couper toute animation de flash sous `prefers-reduced-motion`.

### Don't:
- **Don't** utiliser d'illustration, de dessin ou de mascotte : seulement des photos réelles.
- **Don't** afficher de photo de teckel en couleur dans le site public. Exceptions : les photos d'articles de la boutique (`ProductPhoto`) restent en couleur pour montrer matière et coloris, et le teckel détouré du guide des tailles reste en couleur.
- **Don't** glisser vers le café chaleureux crème, serif et caramel, ni vers le héros « titre + bouton + cartes ».
- **Don't** arrondir les tirages ni les sections : l'arrondi appartient au matériel (boutons, panneau, cases, champs).
- **Don't** employer le jaune jeton en décor ou en texte courant.
- **Don't** ajouter d'ombre décalée en dur ou d'ombre sur des sections et listes plates.
