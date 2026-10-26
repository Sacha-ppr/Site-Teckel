import type { PhotoId } from "./photos";

export type Resident = {
  // Identifiant stable, utilisé en base (dog_presence) : doit rester en minuscules sans accent.
  slug: string;
  name: string;
  photo: PhotoId;
  // Autres poses, affichées sous la fiche.
  more?: PhotoId[];
  age: string;
  coat: string;
  personality: string;
  loves: string;
  // Texte affiché sur le site (« Au bar le »). Doit correspondre à `days`.
  schedule: string;
  // Jours de présence annoncés, 1 = lundi … 7 = dimanche.
  days: number[];
  // Plafond journalier en minutes. Absent = 4 h (charte du bar).
  maxMinutes?: number;
};

export const RESIDENTS: Resident[] = [
  {
    slug: "chorizo",
    name: "Chorizo",
    photo: "chorizo",
    age: "6 ans",
    coat: "Poil ras, rouge",
    personality: "Le chef de salle. Accueille chaque client à la porte, inspecte les sacs.",
    loves: "Les genoux des inconnus",
    schedule: "Mer, jeu, sam",
    days: [3, 4, 6],
  },
  {
    slug: "brioche",
    name: "Brioche",
    photo: "brioche",
    age: "3 ans",
    coat: "Poil long, crème",
    personality: "Douce et un peu timide, elle choisit ses humains avec soin. Une fois adopté, c'est pour la vie.",
    loves: "Les couvertures en polaire",
    schedule: "Mer → dim",
    days: [3, 4, 5, 6, 7],
  },
  {
    slug: "merguez",
    name: "Merguez",
    photo: "merguez",
    age: "2 ans",
    coat: "Poil dur, sanglier",
    personality: "Tornade officielle du bar. Ne marche jamais, il trottine. Champion de la balle à terrier.",
    loves: "Tout ce qui couine",
    schedule: "Ven, sam, dim",
    days: [5, 6, 7],
  },
  {
    slug: "praline",
    name: "Praline",
    photo: "praline",
    age: "8 ans",
    coat: "Poil mi-long, blanc crème",
    personality: "Retraitée active. Fait la sieste au soleil près de la vitrine et accepte les grattouilles avec dignité.",
    loves: "Le rayon de soleil de 15 h",
    schedule: "Jeu, sam",
    days: [4, 6],
  },
  {
    slug: "knacki",
    name: "Knacki",
    photo: "knacki",
    age: "4 ans",
    coat: "Poil ras, arlequin",
    personality: "Le clown de la bande. Maîtrise « assis », « couché » et « vole le croissant ».",
    loves: "Les croissants (surveillez-les)",
    schedule: "Mer, ven, dim",
    days: [3, 5, 7],
  },
  {
    slug: "saucisson",
    name: "Saucisson",
    photo: "saucisson",
    age: "1 an",
    coat: "Poil long, chocolat",
    personality: "Le petit dernier, en apprentissage auprès de Chorizo. Découvre le monde un client à la fois.",
    loves: "Mâchouiller les lacets",
    schedule: "Sam, dim",
    days: [6, 7],
  },
  {
    slug: "blanca",
    name: "Blanca",
    photo: "blanca",
    more: ["blanca-oreilles"],
    age: "5 mois",
    coat: "Poil mi-long, blanc crème",
    personality:
      "La petite dernière de la bande, septième teckel du bar : très câline et pleine d'énergie, elle grimpe sur le premier genou qui se penche.",
    loves: "Les câlins et les courses-poursuites dans la salle",
    schedule: "Mer → sam, 10 h-12 h",
    days: [3, 4, 5, 6],
    // Chiot de 5 mois : deux heures par jour au maximum.
    maxMinutes: 120,
  },
];
