// Données de référence partagées entre le site, les formulaires et l'admin.
// Les valeurs doivent rester alignées sur les contraintes de supabase/schema.sql.

export const SLOTS = ["10:00", "12:00", "14:00", "16:00", "18:00"] as const;
export type Slot = (typeof SLOTS)[number];

export const SLOT_CAPACITY = 16;

export const FREE_SHIPPING_CENTS = 6000;
export const SHIPPING_CENTS = 590;

export const FORMULAS = [
  {
    id: "cafe-calin",
    name: "Café câlin",
    priceCents: 1200,
    duration: "1 h",
    description: "Une boisson chaude, une viennoiserie et une heure avec nos teckels résidents.",
  },
  {
    id: "gouter-teckel",
    name: "Goûter teckel",
    priceCents: 1800,
    duration: "1 h 30",
    description: "Pâtisserie maison, boisson au choix et séance de jeux guidée par un soigneur.",
  },
  {
    id: "apero-saucisse",
    name: "Apéro saucisse",
    priceCents: 2400,
    duration: "1 h 30",
    description: "Planche apéritive, un verre et une friandise offerte pour votre teckel.",
  },
] as const;
export type FormulaId = (typeof FORMULAS)[number]["id"];

export const CATEGORIES = {
  vetements: "Vêtements",
  jouets: "Jouets",
  friandises: "Friandises",
  accessoires: "Accessoires",
} as const;
export type Category = keyof typeof CATEGORIES;

export const RESERVATION_STATUS = {
  confirmee: "Confirmée",
  arrivee: "Arrivée",
  annulee: "Annulée",
  absente: "Absente",
} as const;
export type ReservationStatus = keyof typeof RESERVATION_STATUS;

export const ORDER_STATUS = {
  payee: "Payée",
  preparation: "En préparation",
  expediee: "Expédiée",
  annulee: "Annulée",
} as const;
export type OrderStatus = keyof typeof ORDER_STATUS;

export const CASH_KINDS = { recette: "Recette", depense: "Dépense" } as const;
export type CashKind = keyof typeof CASH_KINDS;

export const CASH_METHODS = { especes: "Espèces", carte: "Carte" } as const;
export type CashMethod = keyof typeof CASH_METHODS;

export const CASH_CATEGORIES = {
  bar: "Bar",
  boutique: "Boutique",
  fournisseur: "Fournisseur",
  charges: "Charges",
  autre: "Autre",
} as const;
export type CashCategory = keyof typeof CASH_CATEGORIES;

export const STOCK_REASONS = {
  livraison: "Livraison",
  casse: "Casse ou péremption",
  vente_bar: "Vente au bar",
  autre: "Autre",
} as const;
export type StockReason = keyof typeof STOCK_REASONS;

// Un teckel ne travaille jamais plus de 4 h par jour (engagement affiché sur le site).
export const MAX_DOG_MINUTES = 240;

export type CashEntry = {
  id: number;
  business_day: string;
  kind: CashKind;
  category: CashCategory;
  method: CashMethod;
  amount_cents: number;
  label: string;
  created_at: string;
};

export type CashClosing = {
  business_day: string;
  opening_float_cents: number;
  counted_cash_cents: number;
  note: string | null;
};

export type DogPresence = {
  id: number;
  business_day: string;
  dog: string;
  status: "presente" | "absente";
  start_time: string | null;
  end_time: string | null;
};

export type StockMovement = {
  id: number;
  product_id: number;
  delta: number;
  reason: StockReason;
  note: string | null;
  created_at: string;
  products: { name: string } | null;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: Category;
  price_cents: number;
  stock: number;
  color: string;
  active: boolean;
};

export type Reservation = {
  id: number;
  user_id: string;
  contact_name: string;
  phone: string | null;
  date: string;
  slot: Slot;
  guests: number;
  formula: FormulaId;
  with_own_dog: boolean;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
};

export type Order = {
  id: number;
  user_id: string;
  status: OrderStatus;
  total_cents: number;
  shipping_cents: number;
  shipping_name: string;
  shipping_address: string;
  created_at: string;
  order_items: { product_name: string; quantity: number; unit_price_cents: number }[];
};

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function formulaName(id: string) {
  return FORMULAS.find((f) => f.id === id)?.name ?? id;
}

// Le bar est fermé le lundi et le mardi.
export function isOpenOn(isoDate: string) {
  const day = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
  return day !== 1 && day !== 2;
}

// Date du jour à Paris, au format AAAA-MM-JJ.
export function parisToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

// Premier et dernier jour d'un mois « AAAA-MM ».
export function monthBounds(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const last = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` };
}

export function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formulaPriceCents(id: string) {
  return FORMULAS.find((f) => f.id === id)?.priceCents ?? 0;
}

// Les prochains jours d'ouverture à partir d'aujourd'hui (heure locale du navigateur).
export function nextOpenDays(count: number) {
  const days: string[] = [];
  const cursor = new Date();
  while (days.length < count) {
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (isOpenOn(iso)) days.push(iso);
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function slotLabel(slot: string) {
  return slot.replace(":00", " h").replace(":", " h ");
}

export function shortDate(isoDate: string) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}
