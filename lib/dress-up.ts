// Données du mini-jeu « Habille ton teckel ».
// Chaque vêtement renvoie à un article de la boutique par son slug : nom et prix viennent du catalogue.

export type Coat = "fauve" | "noir-feu" | "poil-long";

export const COATS: { id: Coat; label: string; hint: string }[] = [
  { id: "fauve", label: "Poil ras fauve", hint: "Le classique roux" },
  { id: "noir-feu", label: "Noir et feu", hint: "Sourcils feu compris" },
  { id: "poil-long", label: "Poil long", hint: "Franges et panache" },
];

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

export type Garment = {
  id: GarmentId;
  label: string;
  slot: Slot;
  category: Category;
  productSlug: string;
  // Cadre de la vignette, dans le repère du chien (viewBox 0 0 420 260).
  iconBox: string;
};

export const GARMENTS: Garment[] = [
  { id: "beret", label: "Béret parisien", slot: "chapeau", category: "tete", productSlug: "beret-parisien", iconBox: "284 24 86 46" },
  { id: "casquette", label: "Casquette", slot: "chapeau", category: "tete", productSlug: "casquette-teckel", iconBox: "290 26 114 44" },
  { id: "lunettes", label: "Lunettes de soleil", slot: "lunettes", category: "tete", productSlug: "lunettes-soleil", iconBox: "314 64 66 32" },
  { id: "mariniere", label: "Marinière", slot: "haut", category: "hauts", productSlug: "pull-marin", iconBox: "128 64 224 126" },
  { id: "manteau", label: "Manteau d'hiver imperméable", slot: "haut", category: "hauts", productSlug: "manteau-saucisse", iconBox: "100 64 226 126" },
  { id: "pull-torsade", label: "Pull torsadé", slot: "haut", category: "hauts", productSlug: "pull-torsade", iconBox: "128 60 224 130" },
  { id: "foulard", label: "Foulard rouge", slot: "cou", category: "accessoires", productSlug: "foulard-rouge", iconBox: "294 100 62 76" },
  { id: "harnais", label: "Harnais ergonomique", slot: "harnais", category: "accessoires", productSlug: "harnais-h", iconBox: "186 92 120 100" },
  { id: "noeud", label: "Nœud papillon", slot: "cou", category: "accessoires", productSlug: "noeud-papillon", iconBox: "302 128 40 30" },
];

export type Look = Partial<Record<Slot, GarmentId>>;

export function garment(id: GarmentId) {
  return GARMENTS.find((g) => g.id === id)!;
}

export function lookGarments(look: Look) {
  return (Object.values(look) as GarmentId[]).map(garment);
}
