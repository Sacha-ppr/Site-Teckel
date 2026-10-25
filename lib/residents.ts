import type { PhotoId } from "./photos";

export type Resident = {
  name: string;
  photo: PhotoId;
  // Autres poses, affichées sous la fiche.
  more?: PhotoId[];
  age: string;
  coat: string;
  personality: string;
  loves: string;
  schedule: string;
};

export const RESIDENTS: Resident[] = [
  {
    name: "Chorizo",
    photo: "chorizo",
    age: "6 ans",
    coat: "Poil ras, rouge",
    personality: "Le chef de salle. Accueille chaque client à la porte, inspecte les sacs.",
    loves: "Les genoux des inconnus",
    schedule: "Mer, jeu, sam",
  },
  {
    name: "Brioche",
    photo: "brioche",
    age: "3 ans",
    coat: "Poil long, crème",
    personality: "Douce et un peu timide, elle choisit ses humains avec soin. Une fois adopté, c'est pour la vie.",
    loves: "Les couvertures en polaire",
    schedule: "Mer → dim",
  },
  {
    name: "Merguez",
    photo: "merguez",
    age: "2 ans",
    coat: "Poil dur, sanglier",
    personality: "Tornade officielle du bar. Ne marche jamais, il trottine. Champion de la balle à terrier.",
    loves: "Tout ce qui couine",
    schedule: "Ven, sam, dim",
  },
  {
    name: "Praline",
    photo: "praline",
    age: "8 ans",
    coat: "Poil mi-long, blanc crème",
    personality: "Retraitée active. Fait la sieste au soleil près de la vitrine et accepte les grattouilles avec dignité.",
    loves: "Le rayon de soleil de 15 h",
    schedule: "Jeu, sam",
  },
  {
    name: "Knacki",
    photo: "knacki",
    age: "4 ans",
    coat: "Poil ras, arlequin",
    personality: "Le clown de la bande. Maîtrise « assis », « couché » et « vole le croissant ».",
    loves: "Les croissants (surveillez-les)",
    schedule: "Mer, ven, dim",
  },
  {
    name: "Saucisson",
    photo: "saucisson",
    age: "1 an",
    coat: "Poil long, chocolat",
    personality: "Le petit dernier, en apprentissage auprès de Chorizo. Découvre le monde un client à la fois.",
    loves: "Mâchouiller les lacets",
    schedule: "Sam, dim",
  },
  {
    name: "Blanca",
    photo: "blanca",
    more: ["blanca-oreilles"],
    age: "5 mois",
    coat: "Poil mi-long, blanc crème",
    personality:
      "La petite dernière de la bande, septième teckel du bar : très câline et pleine d'énergie, elle grimpe sur le premier genou qui se penche.",
    loves: "Les câlins et les courses-poursuites dans la salle",
    schedule: "Mer → ven, 10 h-12 h · sam, jusqu'à 16 h",
  },
];
