export type Resident = {
  name: string;
  age: string;
  coat: string;
  color: string;
  personality: string;
  loves: string;
  schedule: string;
};

export const RESIDENTS: Resident[] = [
  {
    name: "Chorizo",
    age: "6 ans",
    coat: "Poil ras, rouge",
    color: "#b5652b",
    personality: "Le doyen et chef de salle. Accueille chaque client à la porte, inspecte les sacs.",
    loves: "Les genoux des inconnus",
    schedule: "Mer, jeu, sam",
  },
  {
    name: "Brioche",
    age: "3 ans",
    coat: "Poil long, crème",
    color: "#d9b47a",
    personality: "Douce et un peu timide, elle choisit ses humains avec soin. Une fois adopté, c'est pour la vie.",
    loves: "Les couvertures en polaire",
    schedule: "Mer → dim",
  },
  {
    name: "Merguez",
    age: "2 ans",
    coat: "Poil dur, sanglier",
    color: "#6b5444",
    personality: "Tornade officielle du bar. Ne marche jamais, il trottine. Champion de la balle à terrier.",
    loves: "Tout ce qui couine",
    schedule: "Ven, sam, dim",
  },
  {
    name: "Praline",
    age: "8 ans",
    coat: "Poil ras, noir et feu",
    color: "#3a2a20",
    personality: "Retraitée active. Fait la sieste au soleil près de la vitrine et accepte les grattouilles avec dignité.",
    loves: "Le rayon de soleil de 15 h",
    schedule: "Jeu, sam",
  },
  {
    name: "Knacki",
    age: "4 ans",
    coat: "Poil ras, arlequin",
    color: "#8a8178",
    personality: "Le clown de la bande. Maîtrise « assis », « couché » et « vole le croissant ».",
    loves: "Les croissants (surveillez-les)",
    schedule: "Mer, ven, dim",
  },
  {
    name: "Saucisson",
    age: "1 an",
    coat: "Poil long, chocolat",
    color: "#5a3420",
    personality: "Le petit dernier, en apprentissage auprès de Chorizo. Découvre le monde un client à la fois.",
    loves: "Mâchouiller les lacets",
    schedule: "Sam, dim",
  },
];
