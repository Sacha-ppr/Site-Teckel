import type { PhotoId } from "./photos";

// Photo d'ambiance associée à chaque produit du catalogue (pas une photo du produit lui-même).
const BY_SLUG: Record<string, PhotoId> = {
  "manteau-saucisse": "tshirt",
  "pull-marin": "jardin",
  "impermeable-jaune": "rue",
  "peluche-blaireau": "chiot",
  "balle-terrier": "balade",
  "tapis-fouille": "flair",
  "biscuits-saucisse": "rire",
  "os-moelle": "regard",
  "harnais-h": "harnais",
  "rampe-canape": "canape",
  "gamelle-ceramique": "seuil",
  "panier-terrier": "sieste",
};

const FALLBACK: PhotoId[] = ["poil-long", "attente", "guinguette"];

export function productPhoto(slug: string): PhotoId {
  if (BY_SLUG[slug]) return BY_SLUG[slug];
  const hash = [...slug].reduce((n, c) => n + c.charCodeAt(0), 0);
  return FALLBACK[hash % FALLBACK.length];
}
