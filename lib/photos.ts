// Photos libres de droits (Wikimedia Commons), créditées sur /credits.
// Elles illustrent le bar : ce ne sont pas des portraits de nos résidents fictifs.

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  author: string;
  license: string;
  source: string;
  // Recadrage (CSS object-position) pour garder le museau du chien dans le cadre.
  position?: string;
};

export const PHOTOS = {
  "chorizo": { src: "/photos/chorizo.jpg", width: 1000, height: 667, alt: "Teckel à poil ras roux, assis, regard vers l'objectif", title: "Sausage Dog (6719107007).jpg", author: "Eva Rinaldi", license: "CC BY-SA 2.0", source: "https://commons.wikimedia.org/wiki/File:Sausage_Dog_(6719107007).jpg" },
  "brioche": { src: "/photos/brioche.jpg", width: 1280, height: 1707, alt: "Teckel à poil long roux tenant un bâton dans la gueule", title: "Teckel standard.jpg", author: "Lighstore", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Teckel_standard.jpg" },
  "merguez": { src: "/photos/merguez.jpg", width: 1280, height: 2279, alt: "Gros plan sur la tête d'un teckel à poil dur", title: "Wire-Haired Dachshund - Image 01.jpg", author: "3BRBS", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Wire-Haired_Dachshund_-_Image_01.jpg" },
  "praline": { src: "/photos/praline.jpg", width: 1280, height: 1920, alt: "Teckel âgé au museau blanchi, en pull rayé, dans les feuilles mortes", title: "Oscar the Dachshund.jpg", author: "Tony Villatoro", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Oscar_the_Dachshund.jpg" },
  "knacki": { src: "/photos/knacki.jpg", width: 1280, height: 1029, alt: "Teckel arlequin en harnais, tête tournée vers l'objectif", title: "Dachshund Red Merle 2.jpg", author: "Sciencia58", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_Red_Merle_2.jpg" },
  "saucisson": { src: "/photos/saucisson.jpg", width: 1280, height: 853, alt: "Jeune teckel à poil dur assis dans le sable", title: "Teckel - 39.jpg", author: "William Crochot (Medium69)", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Teckel_-_39.jpg" },
  "attente": { src: "/photos/attente.jpg", width: 615, height: 461, alt: "Teckel roux debout sur une terrasse, qui attend", title: "Dachshund-waits-for-the-host.jpg", author: "Irina Pechkareva", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Dachshund-waits-for-the-host.jpg" },
  "guinguette": { src: "/photos/guinguette.jpg", width: 1280, height: 853, alt: "Teckel noir et feu sous une guirlande lumineuse", title: "Lühikarvaline taks otsevaates.jpg", author: "Sillerkiil", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:L%C3%BChikarvaline_taks_otsevaates.jpg" },
  "enfant": { src: "/photos/enfant.jpg", width: 1280, height: 1321, alt: "Un enfant blotti contre son teckel", title: "Kid with dachshund pet.jpg", author: "Photwik Photographer for Kiddle.co", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Kid_with_dachshund_pet.jpg" },
  "rire": { src: "/photos/rire.jpg", width: 1280, height: 1208, alt: "Un enfant rit en serrant un teckel qui tire la langue", title: "Perro salchicha (Dachshund).jpg", author: "Horacio Cambeiro", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Perro_salchicha_(Dachshund).jpg" },
  "sieste": { src: "/photos/sieste.jpg", width: 1280, height: 960, alt: "Teckel à poil long endormi sur une couverture", title: "Long-haired Dachshund Rosie.jpg", author: "ScottCarammell", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Long-haired_Dachshund_Rosie.jpg", position: "80% center" },
  "tshirt": { src: "/photos/tshirt.jpg", width: 1280, height: 946, alt: "Teckel à poil dur en t-shirt, en promenade", title: "Dachshund puppies 3306.jpg", author: "SwarmCheng", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_puppies_3306.jpg" },
  "rue": { src: "/photos/rue.jpg", width: 1280, height: 853, alt: "Teckel assis sur un trottoir à côté d'une borne à incendie", title: "A Dachshund on the streets of Budapest.jpg", author: "Slyronit", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:A_Dachshund_on_the_streets_of_Budapest.jpg" },
  "canape": { src: "/photos/canape.jpg", width: 1280, height: 719, alt: "Teckel à poil dur allongé sur un canapé rouge", title: "Wire-Haired Dachshund - Image 03.jpg", author: "3BRBS", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Wire-Haired_Dachshund_-_Image_03.jpg", position: "68% center" },
  "chiot": { src: "/photos/chiot.jpg", width: 1280, height: 1920, alt: "Jeune teckel à poil dur avec un collier rose", title: "Teckel à poil dur - 20150430 14h47 (10136).jpg", author: "William Crochot (Medium69)", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Teckel_%C3%A0_poil_dur_-_20150430_14h47_(10136).jpg" },
  "flair": { src: "/photos/flair.jpg", width: 1280, height: 848, alt: "Teckel couché dans l'herbe, le museau au ras du sol", title: "Dachshund Sandy.jpg", author: "Beocheck", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_Sandy.jpg", position: "85% center" },
  "harnais": { src: "/photos/harnais.jpg", width: 1280, height: 1029, alt: "Teckel arlequin en harnais, de profil", title: "Dachshund Red Merle 1.jpg", author: "Sciencia58", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_Red_Merle_1.jpg" },
  "regard": { src: "/photos/regard.jpg", width: 1280, height: 1933, alt: "Teckel noir et feu au regard levé", title: "Dackel - Dachshund.jpg", author: "Beocheck", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Dackel_-_Dachshund.jpg" },
  "seuil": { src: "/photos/seuil.jpg", width: 1280, height: 960, alt: "Petit teckel noir et feu sur le seuil d'une cabane", title: "Dachshund wire.JPG", author: "Szabi237", license: "CC BY 3.0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_wire.JPG" },
  "balade": { src: "/photos/balade.jpg", width: 1280, height: 723, alt: "Teckel roux en promenade dans l'herbe", title: "Dachshund LUna in Petrozavodsk.jpg", author: "Thence5", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_LUna_in_Petrozavodsk.jpg", position: "85% center" },
  "poil-long": { src: "/photos/poil-long.jpg", width: 1280, height: 829, alt: "Teckel à poil long roux, de profil", title: "Dachshundstandard-longhair.jpg", author: "Canarian", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Dachshundstandard-longhair.jpg" },
  "jardin": { src: "/photos/jardin.jpg", width: 1280, height: 853, alt: "Teckel noir et feu dans les herbes hautes", title: "Dachshund 2.jpg", author: "Tony Alter", license: "CC BY 2.0", source: "https://commons.wikimedia.org/wiki/File:Dachshund_2.jpg" },
  "chiot-herbe": { src: "/photos/chiot-herbe.jpg", width: 960, height: 640, alt: "Chiot teckel roux assis dans l'herbe, regard attendri", title: "3-month-old dachshund puppy.jpg", author: "Gaseous Wiener", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:3-month-old_dachshund_puppy.jpg" },
  "chiot-mur": { src: "/photos/chiot-mur.jpg", width: 960, height: 1280, alt: "Chiot teckel à poil dur, langue pendante, devant un mur de briques", title: "A wire haired dachshund puppy.jpg", author: "Nicolo.pini92", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:A_wire_haired_dachshund_puppy.jpg" },
  // Photos originales de Blanca, prises pour le projet (pas de source externe).
  "blanca": { src: "/photos/blanca.jpg", width: 1000, height: 1286, alt: "Blanca, jeune teckel crème, allongée dans une flaque de soleil sur un parquet", title: "Blanca au soleil", author: "Le Bar à Teckels", license: "Photo originale", source: "" },
  "blanca-oreilles": { src: "/photos/blanca-oreilles.jpg", width: 1000, height: 1286, alt: "Blanca sur le dos, grandes oreilles dressées, la patte en l'air", title: "Blanca et ses oreilles", author: "Le Bar à Teckels", license: "Photo originale", source: "" },
  "blanca-sieste": { src: "/photos/blanca-sieste.jpg", width: 1000, height: 1286, alt: "Blanca endormie sur le dos dans une couverture crème", title: "Blanca fait la sieste", author: "Le Bar à Teckels", license: "Photo originale", source: "", position: "center 72%" },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof PHOTOS;
