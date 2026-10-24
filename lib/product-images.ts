// Photos des articles de la boutique, générées pour le site (Google Gemini) puis retouchées.
// Vue 1 : l'article seul. Vue 2 : l'article porté ou utilisé par notre teckel modèle.
export type ProductImage = { src: string; alt: string };

const photo = (slug: string, vue: 1 | 2, alt: string): ProductImage => ({ src: `/produits/${slug}-${vue}.webp`, alt });

export const PRODUCT_IMAGES: Record<string, ProductImage> = {
  "balle-terrier": photo("balle-terrier", 1, "Balle en caoutchouc rouge brique"),
  "beret-parisien": photo("beret-parisien", 1, "Béret noir en laine bouillie avec son élastique"),
  "biscuits-saucisse": photo("biscuits-saucisse", 1, "Biscuits en forme de saucisse devant leur sachet kraft"),
  "casquette-teckel": photo("casquette-teckel", 1, "Casquette bleu marine avec ouvertures pour les oreilles"),
  "foulard-rouge": photo("foulard-rouge", 1, "Bandana rouge à motif cachemire plié en triangle"),
  "gamelle-ceramique": photo("gamelle-ceramique", 1, "Gamelle en céramique vert-de-gris sur support en bois"),
  "harnais-h": photo("harnais-h", 1, "Harnais en H en cuir marron, boucles en laiton"),
  "impermeable-jaune": photo("impermeable-jaune", 1, "Ciré jaune moutarde et sa capuche amovible"),
  "lunettes-soleil": photo("lunettes-soleil", 1, "Lunettes de soleil pour chien à sangle réglable"),
  "manteau-saucisse": photo("manteau-saucisse", 1, "Manteau matelassé rouille à col polaire"),
  "noeud-papillon": photo("noeud-papillon", 1, "Nœud papillon en velours noir à clipser"),
  "os-moelle": photo("os-moelle", 1, "Trois os de bœuf séchés"),
  "panier-terrier": photo("panier-terrier", 1, "Panier couvert vieux rose en forme de terrier"),
  "peluche-blaireau": photo("peluche-blaireau", 1, "Peluche blaireau gris"),
  "pull-marin": photo("pull-marin", 1, "Pull marinière rayé bleu marine et écru"),
  "pull-torsade": photo("pull-torsade", 1, "Pull crème en laine torsadée"),
  "rampe-canape": photo("rampe-canape", 1, "Rampe en bois clair à surface moquettée"),
  "tapis-fouille": photo("tapis-fouille", 1, "Tapis de fouille en feutre vert sauge"),
};

// L'article en situation : c'est la vue qui aide à se projeter.
export const PRODUCT_WORN: Record<string, ProductImage> = {
  "balle-terrier": photo("balle-terrier", 2, "Teckel couché, la balle entre les pattes"),
  "beret-parisien": photo("beret-parisien", 2, "Teckel coiffé du béret, porté penché"),
  "biscuits-saucisse": photo("biscuits-saucisse", 2, "Teckel assis devant un biscuit"),
  "casquette-teckel": photo("casquette-teckel", 2, "Teckel portant la casquette, oreilles passées dans les ouvertures"),
  "foulard-rouge": photo("foulard-rouge", 2, "Teckel portant le bandana rouge noué au cou"),
  "gamelle-ceramique": photo("gamelle-ceramique", 2, "Teckel mangeant dans la gamelle surélevée, dos droit"),
  "harnais-h": photo("harnais-h", 2, "Teckel en harnais en H, laisse en cuir"),
  "impermeable-jaune": photo("impermeable-jaune", 2, "Teckel en ciré jaune, capuche relevée"),
  "lunettes-soleil": photo("lunettes-soleil", 2, "Teckel portant les lunettes de soleil"),
  "manteau-saucisse": photo("manteau-saucisse", 2, "Teckel de profil en manteau matelassé rouille"),
  "noeud-papillon": photo("noeud-papillon", 2, "Teckel assis avec le nœud papillon"),
  "os-moelle": photo("os-moelle", 2, "Teckel couché rongeant un os"),
  "panier-terrier": photo("panier-terrier", 2, "Teckel blotti dans le panier terrier"),
  "peluche-blaireau": photo("peluche-blaireau", 2, "Teckel couché, la peluche blaireau dans la gueule"),
  "pull-marin": photo("pull-marin", 2, "Teckel assis en pull marinière"),
  "pull-torsade": photo("pull-torsade", 2, "Teckel couché en pull torsadé crème"),
  "tapis-fouille": photo("tapis-fouille", 2, "Teckel le museau dans le tapis de fouille"),
};

export function productGallery(slug: string): ProductImage[] {
  return [PRODUCT_IMAGES[slug], PRODUCT_WORN[slug]].filter((im): im is ProductImage => Boolean(im));
}
