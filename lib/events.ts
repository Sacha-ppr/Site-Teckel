export type Workshop = {
  title: string;
  when: string;
  priceLabel: string;
  description: string;
  tag: string;
};

export const WORKSHOPS: Workshop[] = [
  {
    title: "Teckel Parade du dimanche",
    when: "Premier dimanche du mois · 11 h",
    priceLabel: "Gratuit",
    tag: "Rencontre",
    description:
      "Venez avec votre teckel pour une balade collective dans le quartier, suivie d'un café au bar. Ambiance garantie.",
  },
  {
    title: "Atelier éducation : le rappel",
    when: "Samedis · 9 h – 10 h",
    priceLabel: "35 € la séance",
    tag: "Éducation",
    description:
      "Le teckel est têtu, c'est dans ses gènes. Notre éducatrice canine vous donne les clés d'un rappel fiable.",
  },
  {
    title: "Prendre soin du dos long",
    when: "Un jeudi sur deux · 19 h",
    priceLabel: "20 €",
    tag: "Santé",
    description:
      "Conférence avec un vétérinaire ostéopathe : prévenir les hernies discales, bons gestes et aménagements.",
  },
  {
    title: "Anniversaire de votre teckel",
    when: "Sur réservation",
    priceLabel: "À partir de 120 €",
    tag: "Privatisation",
    description:
      "Le bar privatisé pour 2 h : gâteau pour chiens, goûter pour les humains, photos souvenirs avec nos résidents.",
  },
  {
    title: "Initiation au pistage",
    when: "Dimanches · 9 h, en forêt de Vincennes",
    priceLabel: "40 €",
    tag: "Sport",
    description:
      "Le teckel est un chien de chasse au flair exceptionnel. Faites-le travailler sur une piste douce et ludique.",
  },
  {
    title: "Club des futurs adoptants",
    when: "Dernier mercredi du mois · 18 h 30",
    priceLabel: "Gratuit",
    tag: "Adoption",
    description:
      "Vous hésitez à adopter un teckel ? Échangez avec des propriétaires, des éleveurs responsables et des associations.",
  },
];
