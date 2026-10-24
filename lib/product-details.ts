// Contenu des fiches produit : arguments « dos long », matière, entretien, tailles et suggestions.
// Le catalogue est fictif (projet d'école) : ces fiches décrivent les articles tels que le bar les vendrait.

export type SizeId = "XS" | "S" | "M" | "L";

// Grille de tailles pour teckels, mesurée en centimètres.
// Dos : de la base du cou à la naissance de la queue. Poitrail : tour, juste derrière les pattes avant.
export const SIZES: { id: SizeId; hint: string; dos: [number, number]; poitrail: [number, number] }[] = [
  { id: "XS", hint: "Kaninchen", dos: [24, 30], poitrail: [30, 36] },
  { id: "S", hint: "Teckel nain", dos: [30, 36], poitrail: [36, 44] },
  { id: "M", hint: "Standard", dos: [36, 43], poitrail: [44, 52] },
  { id: "L", hint: "Standard costaud", dos: [43, 50], poitrail: [52, 60] },
];

// La mesure qui décide : la longueur du dos pour un vêtement, le poitrail pour un harnais.
export type SizeRule = "dos" | "poitrail";

export function recommendSize(dos: number, poitrail: number, rule: SizeRule) {
  const pick = (v: number, key: SizeRule) =>
    SIZES.find((s) => v >= s[key][0] && v < s[key][1]) ?? (v < SIZES[0][key][0] ? SIZES[0] : SIZES[SIZES.length - 1]);
  const main = pick(rule === "dos" ? dos : poitrail, rule);
  const other = pick(rule === "dos" ? poitrail : dos, rule === "dos" ? "poitrail" : "dos");
  return { size: main.id, between: main.id !== other.id ? other.id : null };
}

export type ProductDetails = {
  promise: string;
  points: { title: string; text: string }[];
  matiere: string;
  entretien: string;
  sizes?: SizeRule;
  pairsWith: string[];
};

export const PRODUCT_DETAILS: Record<string, ProductDetails> = {
  "manteau-saucisse": {
    promise: "Le manteau qui couvre tout le dos, jusqu'à la queue.",
    points: [
      { title: "Coupé long", text: "Le patron suit la longueur d'un teckel : pas de bas de dos découvert quand il fait froid." },
      { title: "Fermeture ventrale", text: "Une sangle auto-agrippante sous le ventre : on l'enfile sans lever les pattes avant." },
      { title: "Doublure polaire", text: "Chaude sans être épaisse, pour garder la liberté des épaules." },
    ],
    matiere: "Extérieur nylon déperlant matelassé, doublure polaire recyclée.",
    entretien: "Lavage à 30 °C, séchage à plat.",
    sizes: "dos",
    pairsWith: ["harnais-h", "beret-parisien", "foulard-rouge"],
  },
  "pull-marin": {
    promise: "La marinière, coupée pour un poitrail généreux.",
    points: [
      { title: "Maille côtelée extensible", text: "Elle s'étire au poitrail et reste ajustée sur la taille fine." },
      { title: "Emmanchures dégagées", text: "Les pattes courtes passent sans frotter." },
      { title: "Coton bio", text: "Doux sur le poil ras, respirant en mi-saison." },
    ],
    matiere: "Coton biologique côtelé, rayures tissées.",
    entretien: "Lavage à 30 °C, ne pas sécher en machine.",
    sizes: "dos",
    pairsWith: ["beret-parisien", "foulard-rouge", "noeud-papillon"],
  },
  "impermeable-jaune": {
    promise: "Le ciré breton, version ras du sol.",
    points: [
      { title: "Ventre protégé", text: "Le pan ventral remonte haut : le teckel rentre de balade le ventre sec." },
      { title: "Capuche amovible", text: "Elle se détache par boutons-pression les jours sans pluie." },
      { title: "Bande réfléchissante", text: "Le long du dos, pour être vu à la tombée de la nuit." },
    ],
    matiere: "Toile enduite imperméable, coutures étanchées.",
    entretien: "Rincer à l'eau claire, laisser sécher suspendu.",
    sizes: "dos",
    pairsWith: ["harnais-h", "casquette-teckel"],
  },
  "pull-torsade": {
    promise: "Le pull des longs hivers, en mérinos torsadé.",
    points: [
      { title: "Torsades sur tout le dos", text: "Un tricot épais qui garde la chaleur là où le teckel en perd le plus." },
      { title: "Col roulé souple", text: "Il protège le cou sans serrer le collier ni le harnais." },
      { title: "Bord-côte au ventre", text: "Le pull ne remonte pas quand le teckel s'allonge." },
    ],
    matiere: "Laine mérinos, maille torsadée.",
    entretien: "Lavage à la main à froid, séchage à plat.",
    sizes: "dos",
    pairsWith: ["foulard-rouge", "beret-parisien"],
  },
  "harnais-h": {
    promise: "La traction répartie, jamais sur la colonne.",
    points: [
      { title: "Forme en H", text: "Deux sangles, au poitrail et derrière les côtes, reliées sur le dos : la traction ne pèse pas sur le cou." },
      { title: "Rembourré", text: "Une doublure souple sous chaque sangle, pour les promenades longues." },
      { title: "Anneau dorsal", text: "La laisse s'accroche au milieu du dos, pas sur les vertèbres du cou." },
    ],
    matiere: "Cuir végétal tanné, doublure néoprène, boucles en acier brossé.",
    entretien: "Nourrir le cuir deux fois par an, essuyer à l'eau.",
    sizes: "poitrail",
    pairsWith: ["manteau-saucisse", "impermeable-jaune", "foulard-rouge"],
  },
  "beret-parisien": {
    promise: "Le béret qui tient sur une tête de teckel.",
    points: [
      { title: "Élastique sous le menton", text: "Discret et réglable : le béret reste en place pendant la balade." },
      { title: "Fentes pour les oreilles", text: "Les oreilles tombent naturellement, rien ne les plie." },
      { title: "Taille unique", text: "Le tour de tête se règle d'un geste." },
    ],
    matiere: "Laine bouillie.",
    entretien: "Brosser, lavage à la main si besoin.",
    pairsWith: ["pull-marin", "foulard-rouge", "noeud-papillon"],
  },
  "casquette-teckel": {
    promise: "La casquette qui laisse passer les oreilles.",
    points: [
      { title: "Deux ouvertures", text: "Les oreilles passent dessous, la visière protège les yeux du soleil." },
      { title: "Coton léger", text: "Respirant pour les promenades d'été." },
      { title: "Taille unique réglable", text: "Une patte à scratch à l'arrière." },
    ],
    matiere: "Coton sergé.",
    entretien: "Lavage à la main.",
    pairsWith: ["lunettes-soleil", "impermeable-jaune"],
  },
  "lunettes-soleil": {
    promise: "Des verres filtrants pour les yeux sensibles.",
    points: [
      { title: "Anti-UV", text: "Utiles aux teckels âgés ou aux yeux clairs, en montagne et au bord de l'eau." },
      { title: "Sangle réglable", text: "Elle passe derrière la tête, sous les oreilles." },
      { title: "À introduire doucement", text: "Quelques minutes par jour avec une friandise, avant la première sortie." },
    ],
    matiere: "Monture souple, verres en polycarbonate.",
    entretien: "Chiffon microfibre.",
    pairsWith: ["casquette-teckel", "foulard-rouge"],
  },
  "foulard-rouge": {
    promise: "Le bandana rouge, à nouer au cou.",
    points: [
      { title: "Se noue sur le collier", text: "Ou directement au cou, sans gêner la laisse." },
      { title: "Coton lavable", text: "Il passe en machine avec le linge." },
      { title: "Taille unique", text: "Assez grand pour un standard, se replie pour un nain." },
    ],
    matiere: "Coton imprimé.",
    entretien: "Lavage à 40 °C.",
    pairsWith: ["pull-marin", "harnais-h"],
  },
  "noeud-papillon": {
    promise: "Pour les mariages, les anniversaires et les vernissages.",
    points: [
      { title: "Se clipse au collier", text: "Pas de nœud à faire, il se met et s'enlève en une seconde." },
      { title: "Velours", text: "Il tient sa forme même quand le teckel se secoue." },
      { title: "Taille unique", text: "Proportionné pour un cou de teckel." },
    ],
    matiere: "Velours de coton.",
    entretien: "Brosser.",
    pairsWith: ["pull-marin", "beret-parisien"],
  },
  "peluche-blaireau": {
    promise: "Pour rappeler à votre teckel son métier d'origine.",
    points: [
      { title: "Couineur intégré", text: "Le teckel a été sélectionné pour chasser le blaireau : ce jouet parle à son instinct." },
      { title: "Coutures renforcées", text: "Pensées pour les mâchoires qui secouent." },
      { title: "Taille d'une gueule de teckel", text: "Assez petite pour être portée fièrement." },
    ],
    matiere: "Peluche polyester, couineur amovible.",
    entretien: "Lavage à 30 °C sans le couineur.",
    pairsWith: ["balle-terrier", "tapis-fouille"],
  },
  "balle-terrier": {
    promise: "La balle à la taille des petites mâchoires.",
    points: [
      { title: "Diamètre 5 cm", text: "Elle se saisit sans forcer, sans risque d'être avalée." },
      { title: "Caoutchouc naturel", text: "Rebond imprévisible : elle réveille le chasseur." },
      { title: "Flotte", text: "Pour les teckels qui aiment l'eau, il y en a." },
    ],
    matiere: "Caoutchouc naturel.",
    entretien: "Rincer à l'eau.",
    pairsWith: ["peluche-blaireau", "tapis-fouille"],
  },
  "tapis-fouille": {
    promise: "Cachez les friandises, laissez le flair travailler.",
    points: [
      { title: "Fatigue la tête", text: "Dix minutes de fouille valent une longue promenade pour un chien de flair." },
      { title: "Ralentit les gloutons", text: "Les croquettes y durent plus longtemps que dans une gamelle." },
      { title: "Antidérapant", text: "Il reste en place sur le parquet." },
    ],
    matiere: "Plastique alimentaire sans BPA, base antidérapante.",
    entretien: "Lave-vaisselle, panier du haut.",
    pairsWith: ["biscuits-saucisse", "os-moelle"],
  },
  "biscuits-saucisse": {
    promise: "Des biscuits au foie de volaille, cuits en petit lot.",
    points: [
      { title: "Petite taille", text: "Parfaits pour l'éducation : une récompense, une bouchée." },
      { title: "Peu d'ingrédients", text: "Foie de volaille, farine d'avoine, œuf. Rien d'autre." },
      { title: "Sachet de 200 g", text: "Refermable, à garder dans la poche de balade." },
    ],
    matiere: "Foie de volaille, avoine, œuf.",
    entretien: "À conserver au sec, à consommer dans le mois.",
    pairsWith: ["tapis-fouille", "os-moelle"],
  },
  "os-moelle": {
    promise: "À mâcher longtemps, sans additif.",
    points: [
      { title: "Bœuf séché", text: "Un seul ingrédient, séché lentement." },
      { title: "Bon pour les dents", text: "La mastication longue aide à limiter le tartre." },
      { title: "Lot de 3", text: "Toujours sous surveillance, à retirer quand il devient petit." },
    ],
    matiere: "Bœuf séché.",
    entretien: "À conserver au sec.",
    pairsWith: ["biscuits-saucisse", "tapis-fouille"],
  },
  "gamelle-ceramique": {
    promise: "La gamelle à hauteur de pattes courtes.",
    points: [
      { title: "Surélevée de quelques centimètres", text: "Le teckel mange sans courber le cou vers le sol." },
      { title: "Lourde", text: "Elle ne se promène pas dans la cuisine." },
      { title: "Émail sans plomb", text: "Hygiénique, elle passe au lave-vaisselle." },
    ],
    matiere: "Céramique émaillée.",
    entretien: "Lave-vaisselle.",
    pairsWith: ["tapis-fouille", "biscuits-saucisse"],
  },
  "rampe-canape": {
    promise: "Ménagez le dos de votre teckel : finis les sauts.",
    points: [
      { title: "Pente douce", text: "Les sauts répétés du canapé fragilisent les disques vertébraux du teckel." },
      { title: "Revêtement antidérapant", text: "Les griffes accrochent, même en descente." },
      { title: "Hauteur réglable", text: "Pour un canapé, un lit ou le coffre de la voiture." },
    ],
    matiere: "Structure en bois, revêtement moquette.",
    entretien: "Aspirateur.",
    pairsWith: ["panier-terrier", "harnais-h"],
  },
  "panier-terrier": {
    promise: "Le panier couvert pour ceux qui aiment s'enfouir.",
    points: [
      { title: "Un toit souple", text: "Le teckel s'y glisse comme dans un terrier : il se sent à l'abri." },
      { title: "Coussin déhoussable", text: "Toute la housse passe en machine." },
      { title: "Bords bas à l'entrée", text: "On y entre sans sauter." },
    ],
    matiere: "Coton épais, garnissage ouate recyclée.",
    entretien: "Housse lavable à 30 °C.",
    pairsWith: ["rampe-canape", "peluche-blaireau"],
  },
};
