// Contenus commerciaux du bar : carte des chiens, packs, fidélité, dons, avis.
import type { PhotoId } from "./photos";

export const DOG_MENU = [
  { name: "Pupuccino", price: "3 €", text: "Crème de coco fouettée, sans sucre ni lactose, servie dans un gobelet à leur taille." },
  { name: "Bouillon des rois", price: "2 €", text: "Bouillon de bœuf tiède, sans sel ajouté." },
  { name: "Glace saucisse", price: "4 €", text: "Purée de patate douce et yaourt végétal, glacés en petit cornet." },
  { name: "Biscuit du jour", price: "2 €", text: "Cuit maison le matin, à partager avec les résidents." },
] as const;

export const HUMAN_MENU = [
  { name: "Café, thé, chocolat chaud", price: "3,50 €" },
  { name: "Cookie maison", price: "3 €" },
  { name: "Planche saucisson & fromages", price: "12 €" },
  { name: "Verre de vin ou bière", price: "5 €" },
] as const;

export type Pack = { id: string; name: string; text: string; slugs: string[] };
// Articles sans taille uniquement : ils s'ajoutent d'un seul clic.
export const PACKS: Pack[] = [
  { id: "fouille", name: "Pack Fouille & Grignote", text: "Le tapis, les biscuits et l'os à moelle : de quoi occuper un teckel curieux.", slugs: ["tapis-fouille", "biscuits-saucisse", "os-moelle"] },
  { id: "jeux", name: "Pack Jeux", text: "Peluche, balle et tapis : trois façons de dépenser l'énergie sans fatiguer le dos.", slugs: ["peluche-blaireau", "balle-terrier", "tapis-fouille"] },
  { id: "salon", name: "Pack Salon", text: "Gamelle, panier et peluche pour installer un coin à lui.", slugs: ["gamelle-ceramique", "panier-terrier", "peluche-blaireau"] },
];

export const GIFT_AMOUNTS = [20, 36, 50, 80] as const;

export const LOYALTY_STAMPS = 8;
export const LOYALTY_REWARD = "Un Café câlin offert, à réclamer au comptoir.";

// Associations partenaires. Aucun don réel n'est prélevé.
export const ASSOCIATIONS = [
  {
    id: "spa",
    name: "SPA",
    text: "Société protectrice des animaux : accueil et adoption d'animaux abandonnés.",
    url: "https://www.la-spa.fr/",
  },
  {
    id: "30mda",
    name: "30 Millions d'Amis",
    text: "Fondation qui protège les animaux et soutient les refuges.",
    url: "https://www.30millionsdamis.fr/",
  },
  {
    id: "bardot",
    name: "Fondation Brigitte Bardot",
    text: "Refuges, stérilisation et lutte contre l'abandon, partout en France.",
    url: "https://www.fondationbrigittebardot.fr/",
  },
] as const;
export const DONATION_AMOUNTS = [2, 5, 10, 20] as const;

// AVIS D'EXEMPLE : textes fictifs de démonstration (projet scolaire), à remplacer par de vrais avis.
export type Review = { name: string; dog: string; text: string; photo?: PhotoId };
export const SAMPLE_REVIEWS: Review[] = [
  { name: "Camille, 28 ans", dog: "avec Olive, teckel", text: "Olive a trouvé sa place sur les genoux de Brioche en cinq minutes. On revient samedi." },
  { name: "Maxime, 31 ans", dog: "premier rendez-vous", text: "Le Goûter teckel, c'est le meilleur moyen de briser la glace. Ça a marché." },
  { name: "Inès et Léo", dog: "famille", text: "Les enfants ne voulaient plus partir. Chorizo leur a fait la tournée des câlins." },
  { name: "Sophie, 44 ans", dog: "avec Gaston, teckel", text: "Le harnais en H est parfait pour le dos de Gaston. Taille conseillée juste du premier coup." },
  { name: "Nadia, 36 ans", dog: "entre amies", text: "L'Apéro saucisse avec les teckels autour de la table : on a oublié nos téléphones." },
  { name: "Théo, 25 ans", dog: "anniversaire", text: "On a fêté mon anniversaire ici. Merguez a volé la vedette sur toutes les photos." },
  { name: "Lola, 33 ans", dog: "avec Pomme, teckel", text: "Blanca s'est endormie sur le dos, patte en l'air, en plein milieu du goûter. Le bar le plus apaisant de Paris.", photo: "blanca-sieste" },
];
