// Données de la cabine d'essayage « Habille ton teckel ».
// Chaque vêtement renvoie à un article de la boutique par son slug : nom et prix viennent du catalogue.

// Repères d'un teckel photographié de profil, tête à droite, en % de la scène (3:2).
export type Landmarks = {
  body: { rump: number; chest: number; back: number; belly: number };
  eye: [number, number];
  nose: [number, number];
  top: [number, number]; // haut du crâne, là où se pose un chapeau
  throat: [number, number];
  tilt: number; // inclinaison de la tête, en degrés
};

export type ModelId = "fauve" | "noir-feu" | "poil-dur";

export type Model = {
  id: ModelId;
  label: string;
  image: string;
  // Éclaircissement de la photo pour l'ombrage des tissus (les pelages sombres en demandent plus).
  shadeGain: number;
  landmarks: Landmarks;
  credit: { title: string; author: string; license: string; source: string };
};

// Vraies photos de teckels, détourées et cadrées de profil (sources sur /credits).
export const MODELS: Model[] = [
  {
    id: "fauve",
    label: "Poil ras fauve",
    image: "/cabine/fauve.webp",
    shadeGain: 1.15,
    landmarks: {
      body: { rump: 14.5, chest: 76, back: 50, belly: 76 },
      eye: [77, 22.5],
      nose: [88.5, 27.5],
      top: [72, 19.5],
      throat: [72, 45],
      tilt: 4,
    },
    credit: {
      title: "닥스훈트(단모종) (Dachshund (Short)).jpg",
      author: "Katemil94",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:%EB%8B%A5%EC%8A%A4%ED%9B%88%ED%8A%B8(%EB%8B%A8%EB%AA%A8%EC%A2%85)_(Dachshund_(Short)).jpg",
    },
  },
  {
    id: "noir-feu",
    label: "Noir et feu",
    image: "/cabine/noir-feu.webp",
    shadeGain: 3.2,
    landmarks: {
      body: { rump: 14, chest: 74, back: 48, belly: 74 },
      eye: [77, 28.5],
      nose: [88, 32],
      top: [71.5, 26],
      throat: [72.5, 47],
      tilt: 4,
    },
    credit: {
      title: "Teckel Fond Blanc.jpg",
      author: "Desaix83, d'après Томасина",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Teckel_Fond_Blanc.jpg",
    },
  },
  {
    id: "poil-dur",
    label: "Poil dur",
    image: "/cabine/poil-dur.webp",
    shadeGain: 1.9,
    landmarks: {
      body: { rump: 28, chest: 77, back: 55, belly: 74 },
      eye: [80, 36.5],
      nose: [88, 36.5],
      top: [75.5, 32.5],
      throat: [76.5, 53],
      tilt: -4,
    },
    credit: {
      title: "Dachshund mini (full).JPG",
      author: "Томасина",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:Dachshund_mini_(full).JPG",
    },
  },
];

// Repères par défaut pour une photo envoyée par le visiteur : un teckel de profil qui remplit le cadre.
export const DEFAULT_LANDMARKS: Landmarks = MODELS[0].landmarks;

// Un seul vêtement par emplacement : en choisir un autre remplace le précédent.
export type Slot = "chapeau" | "lunettes" | "haut" | "cou" | "harnais";

export type Category = "tete" | "hauts" | "accessoires";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "tete", label: "Tête" },
  { id: "hauts", label: "Hauts & manteaux" },
  { id: "accessoires", label: "Accessoires" },
];

export type GarmentId =
  | "beret"
  | "casquette"
  | "lunettes"
  | "mariniere"
  | "manteau"
  | "pull-torsade"
  | "foulard"
  | "harnais"
  | "noeud";

// Où s'accroche une pièce : le corps (suit la silhouette), l'œil, le haut du crâne ou la gorge.
export type Anchor = "corps" | "oeil" | "crane" | "gorge";

export type Garment = {
  id: GarmentId;
  label: string;
  slot: Slot;
  category: Category;
  productSlug: string;
  anchor: Anchor;
  // Cadre du dessin, dans le repère du gabarit (viewBox 0 0 420 260, teckel tourné vers la droite).
  box: [number, number, number, number];
};

const TOP_BOX: [number, number, number, number] = [128, 86, 194, 98];

export const GARMENTS: Garment[] = [
  { id: "beret", label: "Béret parisien", slot: "chapeau", category: "tete", productSlug: "beret-parisien", anchor: "crane", box: [284, 24, 86, 46] },
  { id: "casquette", label: "Casquette", slot: "chapeau", category: "tete", productSlug: "casquette-teckel", anchor: "crane", box: [290, 26, 114, 44] },
  { id: "lunettes", label: "Lunettes de soleil", slot: "lunettes", category: "tete", productSlug: "lunettes-soleil", anchor: "oeil", box: [314, 64, 66, 32] },
  { id: "mariniere", label: "Marinière", slot: "haut", category: "hauts", productSlug: "pull-marin", anchor: "corps", box: TOP_BOX },
  { id: "manteau", label: "Manteau d'hiver imperméable", slot: "haut", category: "hauts", productSlug: "manteau-saucisse", anchor: "corps", box: [104, 86, 218, 98] },
  { id: "pull-torsade", label: "Pull torsadé", slot: "haut", category: "hauts", productSlug: "pull-torsade", anchor: "corps", box: TOP_BOX },
  { id: "foulard", label: "Foulard rouge", slot: "cou", category: "accessoires", productSlug: "foulard-rouge", anchor: "gorge", box: [294, 100, 62, 76] },
  { id: "harnais", label: "Harnais ergonomique", slot: "harnais", category: "accessoires", productSlug: "harnais-h", anchor: "corps", box: [186, 90, 124, 102] },
  { id: "noeud", label: "Nœud papillon", slot: "cou", category: "accessoires", productSlug: "noeud-papillon", anchor: "gorge", box: [302, 128, 40, 30] },
];

export function garment(id: GarmentId) {
  return GARMENTS.find((g) => g.id === id)!;
}

// Points d'accroche dans le gabarit SVG.
const SVG = {
  rump: 72,
  chest: 310,
  back: 104,
  belly: 182,
  eye: [356, 81] as const,
  nose: [403, 99] as const,
  top: [326, 56] as const,
  throat: [324, 126] as const,
};

// Les accessoires de tête sont un peu plus petits que la tête dessinée du gabarit.
const HEAD_SCALE: Record<Exclude<Anchor, "corps">, number> = { crane: 0.9, oeil: 0.8, gorge: 0.75 };

// Position d'une pièce sur la scène, en % (centre, largeur, hauteur) et en degrés.
export type Placement = { x: number; y: number; w: number; h: number; rot: number };

// La scène fait 3:2 : un % horizontal vaut 2/3 d'un % vertical en pixels.
const ASPECT = 1.5;

export function placeGarment(g: Garment, lm: Landmarks): Placement {
  const [bx, by, bw, bh] = g.box;
  if (g.anchor === "corps") {
    const sx = (lm.body.chest - lm.body.rump) / (SVG.chest - SVG.rump);
    const sy = (lm.body.belly - lm.body.back) / (SVG.belly - SVG.back);
    return {
      x: lm.body.rump + (bx + bw / 2 - SVG.rump) * sx,
      y: lm.body.back + (by + bh / 2 - SVG.back) * sy,
      w: bw * sx,
      h: bh * sy,
      rot: 0,
    };
  }
  // Tête et cou : échelle donnée par la longueur œil–truffe, identique en largeur et en hauteur.
  const sxHead = ((lm.nose[0] - lm.eye[0]) / (SVG.nose[0] - SVG.eye[0])) * HEAD_SCALE[g.anchor];
  const syHead = sxHead * ASPECT;
  const [ax, ay] = g.anchor === "oeil" ? SVG.eye : g.anchor === "crane" ? SVG.top : SVG.throat;
  const [px, py] = g.anchor === "oeil" ? lm.eye : g.anchor === "crane" ? lm.top : lm.throat;
  return {
    x: px + (bx + bw / 2 - ax) * sxHead,
    y: py + (by + bh / 2 - ay) * syHead,
    w: bw * sxHead,
    h: bh * syHead,
    rot: g.anchor === "gorge" ? 0 : lm.tilt,
  };
}
